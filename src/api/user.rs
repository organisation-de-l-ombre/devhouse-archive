use crate::database::link::NewLink;
use crate::database::schema::links::dsl::links;
use crate::database::schema::users::dsl::{id, users};
use crate::database::user::{NewUser, User, UserUpdate, UserOtpKeyUpdate};
use crate::diesel::RunQueryDsl;
use crate::types::db_error::db_error;
use crate::types::ScarletError;
use crate::ScarletDB;
use diesel::result::Error;
use diesel::{ExpressionMethods, QueryDsl};
use rocket::http::Status;
use rocket_contrib::json::Json;
use rocket_contrib::uuid::Uuid;
use serde::{ Deserialize };
use uuid::UuidVersion;
use rand::Rng;
use base32::{ encode, Alphabet };

/// get_user_by_id - GET /user/:id
/// Get a user information by id.
/// Returns 403 if the user is banned.
#[get("/user/<user>")]
pub fn get_user_by_id(conn: ScarletDB, user: Uuid) -> Result<Json<User>, Json<ScarletError>> {
    let result: Result<User, diesel::result::Error> = users
        .filter(id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap()))
        .first::<User>(&*conn);

    match result {
        Ok(user) => {
            if user.ban.is_some() {
                return Err(Json(ScarletError {
                    code: 0,
                    message: "This user does not exists.".to_string(),
                }));
            }
            Ok(Json(user))
        }
        Err(e) => {
            match e {
                Error::NotFound => Err(Json(ScarletError {
                    code: 0,
                    message: "This user does not exists.".to_string(),
                })),
                e => Err(Json(db_error(e)))
            }
        },
    }
}

/// patch_user_by_id - PATCH /user/:id
/// Edits a user profile, only certain fields
/// can be edited.
#[patch("/user/<user>", data = "<update>")]
pub fn patch_user_by_id(
    conn: ScarletDB,
    user: Uuid,
    update: Json<UserUpdate>,
) -> Result<Status, Json<ScarletError>> {
    let result: Result<usize, Error> = diesel::update(users)
        .filter(id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap()))
        .set(update.0)
        .execute(&*conn);

    if result.is_ok() {
        return Ok(Status::Accepted);
    }
    return
        match result.err().unwrap() {
            Error::NotFound => Err(Json(ScarletError {
                code: 0,
                message: "This user does not exists.".to_string(),
            })),
            e => Err(Json(db_error(e)))
        }
}

/// delete_user_by_id - DELETE /user/:id
/// Deletes a user profile, DO NOT USE,
/// call the cryir service to handle this
/// kind of stuff.
#[delete("/user/<user>")]
pub fn delete_user_by_id(conn: ScarletDB, user: Uuid) -> Result<Status, Json<ScarletError>> {
    let result =
        diesel::delete(users.filter(id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap())))
            .execute(&*conn);

    match result {
        Ok(_) => Ok(Status::Ok),
        Err(e) => {
            match e {
                Error::NotFound => Err(Json(ScarletError {
                    code: 0,
                    message: "This user does not exists.".to_string(),
                })),
                _ => Err(Json(db_error(e)))
            }
        },
    }
}

#[derive(Deserialize, Clone)]
pub struct CreateUserPayload {
    platform: String,
    platform_id: String,
    username: String,
    private: bool,
    avatar: String,
}

/// post_user - POST /user
/// Creates a user profile using some preferences,
/// and a linked account.
#[post("/user", data = "<user>")]
pub fn post_user(conn: ScarletDB, user: Json<CreateUserPayload>) -> Result<Json<User>, Status> {
    let uuid = uuid::Uuid::new(uuid::UuidVersion::Random).unwrap();
    let create = diesel::insert_into(users)
        .values(NewUser {
            id: &uuid,
            username: &user.username,
            private: &user.private,
            avatar: &user.avatar,
        })
        .execute(&*conn);

    match create {
        Ok(_) => {
            let new_platform = user.clone();
            let create = diesel::insert_into(links)
                .values(NewLink {
                    id: uuid::Uuid::new(UuidVersion::Random).unwrap(),
                    platform: new_platform.platform,
                    platform_id: new_platform.platform_id,
                    user_id: uuid,
                })
                .execute(&*conn);

            if !create.is_ok() {
                return Err(Status::InternalServerError);
            }

            let res: Result<User, Error> = users.filter(id.eq(uuid)).first::<User>(&*conn);

            if res.is_ok() {
                return Ok(Json(res.unwrap()));
            }
            return Err(Status::InternalServerError);
        }
        Err(_) => Err(Status::InternalServerError),
    }
}

#[put("/user/<user>/totp")]
pub fn enable_totp(conn: ScarletDB, user: Uuid) -> Result<Json<UserOtpKeyUpdate>, Json<ScarletError>> {
    let random_bytes = rand::thread_rng().gen::<[u8; 20]>();
    let code: String = encode(Alphabet::RFC4648 { padding: false }, &random_bytes);
    let update = UserOtpKeyUpdate{ otpkey: Some(code) };

    let result: Result<usize, Error> = diesel::update(users)
        .filter(id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap()))
        .set(&update)
        .execute(&*conn);

    if result.is_ok() {
        return Ok(Json(update));
    }
    return
        match result.err().unwrap() {
            Error::NotFound => Err(Json(ScarletError {
                code: 0,
                message: "This user does not exists.".to_string(),
            })),
            e => Err(Json(db_error(e)))
        }

}
