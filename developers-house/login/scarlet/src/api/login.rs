use crate::database::link::Link;
use crate::database::schema::links::dsl::{links, platform, platform_id};
use crate::database::schema::users::dsl::users;
use crate::database::user::User;
use crate::diesel::RunQueryDsl;
use crate::{RedisDB, ScarletDB};
use diesel::result::Error;
use diesel::{ExpressionMethods, QueryDsl};
use redis::RedisError;
use rocket::http::Status;
use rocket_contrib::databases::redis::Commands;
use rocket_contrib::json::Json;
use rocket_contrib::uuid::Uuid;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct WithPlatform {
    platform_id: String,
    platform_name: String,
}

#[derive(Serialize, Deserialize)]
pub struct WithWebAuthn {}

#[derive(Serialize, Deserialize)]
pub struct WithOTP {}

#[derive(Serialize, Deserialize)]
pub struct LoginDataPost {
    with_platform: Option<WithPlatform>,
    with_webauthn: Option<WithWebAuthn>,
    with_otp: Option<WithOTP>,
}

#[derive(Serialize, Deserialize)]
pub struct LoginSessionState {
    id: Option<uuid::Uuid>,
    done: bool,
    user: Option<User>,
}

/// start_login_session - POST /login
/// Creates a login session, used to complete
/// the login flow, if the request is successful,
/// the complete flag will be true, in the other
/// case, a login session_id will be assigned and
/// used to validate the request using other login
/// methods.
#[post("/login", data = "<data>")]
pub fn start_login_session(
    redis: RedisDB,
    conn: ScarletDB,
    data: Json<LoginDataPost>,
) -> Result<Json<LoginSessionState>, Status> {
    if !data.with_platform.is_some() {
        return Err(Status::BadRequest);
    }

    let link = data.with_platform.as_ref().unwrap();
    let rec_link: Result<Link, Error> = links
        .filter(platform_id.eq(&link.platform_id))
        .filter(platform.eq(&link.platform_name))
        .first::<Link>(&*conn);

    match rec_link {
        Ok(link) => {
            let req_user: Result<User, Error> = users.find(link.user_id).first(&*conn);

            match req_user {
                Ok(user) => {
                    if user.a2f {
                        let uuid = uuid::Uuid::new(uuid::UuidVersion::Random).unwrap();
                        let state = LoginSessionState {
                            id: Some(uuid),
                            done: false,
                            user: None,
                        };
                        let json = serde_json::to_string(&state).unwrap();
                        let key = format!("scarlet:session:{}", uuid.to_string());
                        let result: Result<String, RedisError> = redis.0.set(key.clone(), json);
                        redis
                            .0
                            .expire::<String, String>(key.clone(), 60 * 5)
                            .unwrap();
                        match result {
                            Ok(_) => Ok(Json(state)),
                            Err(_) => Err(Status::InternalServerError),
                        }
                    } else {
                        Ok(Json(LoginSessionState {
                            id: None,
                            done: true,
                            user: Some(user),
                        }))
                    }
                }
                Err(_) => Err(Status::InternalServerError),
            }
        }
        Err(_) => Err(Status::NotFound),
    }
}

/// get_login_session - GET /login/:id
/// Get a login session by session_id
#[get("/login/<id>")]
pub fn get_login_session(id: Uuid, redis: RedisDB) -> Result<Json<LoginSessionState>, Status> {
    let result: Result<String, RedisError> =
        redis.0.get(format!("scarlet:session:{}", id.to_string()));

    match result {
        Ok(result) => Ok(Json(
            serde_json::from_str::<LoginSessionState>(&result).unwrap(),
        )),
        Err(_) => Err(Status::NotFound),
    }
}

/// post_to_login_session - POST /login/:id
/// Add a login validation to the login session
/// using the session_id.
#[post("/login/<id>")]
pub fn post_to_login_session(id: Uuid) {}
