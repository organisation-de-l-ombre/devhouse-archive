use rocket_contrib::uuid::Uuid;
use crate::database::schema::users::dsl::{users, id};
use diesel::{QueryDsl, ExpressionMethods};
use crate::database::user::{User, NewUser, UserUpdate};
use rocket_contrib::json::Json;
use crate::database::establish_connection;
use crate::diesel::RunQueryDsl;
use rocket::http::Status;
use serde::Deserialize;
use uuid::UuidVersion;
use crate::database::schema::links::dsl::links;
use crate::database::link::{NewLink};
use diesel::result::Error;

/// get_user_by_id - GET /user/:id
/// Get a user information by id.
/// Returns 403 if the user is banned.
#[get("/user/<user>")]
pub fn get_user_by_id (user: Uuid) -> Result<Json<User>, Status> {
    let conn = establish_connection();

    let result: Result<User, diesel::result::Error> = users
        .filter(id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap()))
        .first::<User>(&conn);

    match result {
        Ok(user) => {
            if user.ban.is_some() {
                return Err(Status::Unauthorized);
            }
            Ok(Json(user))
        }
        Err(e) => {

            match e {
                Error::NotFound => Err(Status::NotFound),
                _ => Err(Status::InternalServerError)
            }
        }
    }
}

/// patch_user_by_id - PATCH /user/:id
/// Edits a user profile, only certain fields
/// can be edited.
#[patch("/user/<user>", data = "<update>")]
pub fn patch_user_by_id (user: Uuid, update: Json<UserUpdate>) -> Result<Status, Status> {
    let conn = establish_connection();
    let result: Result<usize, Error> = diesel::update(users)
        .filter(id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap()))
        .set(update.0)
        .execute(&conn);

    if result.is_ok() {
        return Ok(Status::Accepted)
    }
    return Err(Status::InternalServerError)
}

/// delete_user_by_id - DELETE /user/:id
/// Deletes a user profile, DO NOT USE,
/// call the cryir service to handle this
/// kind of stuff.
#[delete("/user/<user>")]
pub fn delete_user_by_id (user: Uuid) -> Result<Status, Status> {
    let conn = establish_connection();

    let result = diesel::delete(users
        .filter(id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap())))
        .execute(&conn);

    if result.is_ok() && result.unwrap() > 0 {
        Ok(Status::Ok)
    } else {
        Err(Status::NoContent)
    }
}

#[derive(Deserialize)]
pub struct CreateUserPayload {
    platform: String,
    platform_id: String,
    username: String,
    private: bool,
}

/// post_user - POST /user
/// Creates a user profile using some preferences,
/// and a linked account.
#[post("/user", data="<user>")]
pub fn post_user (user: Json<CreateUserPayload>) -> Result<Json<User>, Status> {
    let conn = establish_connection();
    let uuid = &uuid::Uuid::new(uuid::UuidVersion::Random).unwrap();
    let create = diesel::insert_into(users)
        .values(NewUser{
            id: uuid,
            username: &user.username,
            private: &user.private
        })
        .execute(&conn);

    match create {
        Ok(_) => {
            let create = diesel::insert_into(links)
                .values(NewLink {
                    id: &uuid::Uuid::new(UuidVersion::Random).unwrap(),
                    platform: &user.platform,
                    platform_id: &user.platform_id,
                    user_id: uuid
                })
                .execute(&conn);

            if !create.is_ok() {
                return Err(Status::InternalServerError)
            }

            let res: Result<User, Error> = users
                .filter(id.eq(uuid))
                .first::<User>(&conn);

            if res.is_ok() {
                return Ok(Json(res.unwrap()));
            }
            return Err(Status::InternalServerError)
        }
        Err(_) => {
            Err(Status::InternalServerError)
        }
    }
}