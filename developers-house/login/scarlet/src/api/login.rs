use crate::database::link::Link;
use crate::database::schema::links::dsl::{links, platform, platform_id, user_id};
use crate::database::schema::users::dsl::{users, id};
use crate::database::user::User;
use crate::diesel::RunQueryDsl;
use crate::ScarletDB;
use diesel::associations::HasTable;
use diesel::result::Error;
use diesel::{BoolExpressionMethods, ExpressionMethods, JoinOnDsl, QueryDsl};
use otp::make_totp;
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};
use rocket::http::Status;

#[derive(Serialize, Deserialize)]
pub struct WithPlatform {
    platform_id: String,
    platform_name: String,
}

#[derive(Serialize, Deserialize)]
pub struct WithWebAuthn {}

#[derive(Serialize, Deserialize)]
pub struct WithOTP {
    code: u32,
}

#[derive(Serialize, Deserialize)]
pub struct LoginDataPost {
    with_platform: Option<WithPlatform>,
    with_webauthn: Option<WithWebAuthn>,
    with_otp: Option<WithOTP>,
}

#[derive(Serialize)]
pub enum LoginStatus {
    #[serde(rename = "UNKNOWN_USER")]
    UnknownUser,
    #[serde(rename = "TWO_FACTOR_REQUIRED")]
    TwoFactorRequired,
    #[serde(rename = "SUCCESS")]
    Success,
    #[serde(rename = "FAILED")]
    Failed
}

#[derive(Serialize)]
pub struct LoginStatusReponse {
    status: LoginStatus,
    user: Option<User>
} 

pub fn do_user_login(data: LoginDataPost, db: ScarletDB) -> Result<LoginStatusReponse, Status> {
    let with_otp = data.with_otp.as_ref();
    let with_platform = data.with_platform.as_ref();
    let with_webauthn = data.with_webauthn.as_ref();

    if with_platform.is_some() {
        let q_plat = with_platform.unwrap();
        let rec_link: Result<Vec<(User, Option<Link>)>, Error> = users
            .left_join(
                links::table().on(user_id.eq(id)),
            )
            .filter(platform.eq(&q_plat.platform_name).and(platform_id.eq(&q_plat.platform_id)))
            .load::<(User, _)>(&*db);

        return match rec_link {
            Ok(res) => {
                if res.len() >= 1 {
                    let count: Vec<User> = res
                        .into_iter()
                        .map::<User, _>(|val: (User, Option<Link>)| return val.0)
                        .rev()
                        .collect();
                    let user: &User = count.get(0).unwrap();

                    if user.ban.is_some() {
                        return Ok(LoginStatusReponse {
                            user: None,
                            status: LoginStatus::UnknownUser
                        });
                    }

                    if user.a2f && (user.otpkey.is_some()) {
                        if with_otp.is_some() {
                            if check_otp(with_otp.unwrap(), user) {
                                Ok(LoginStatusReponse {
                                    user: Some(user.clone()),
                                    status: LoginStatus::Success
                                })
                            } else {
                                Ok(LoginStatusReponse {
                                    user: None,
                                    status: LoginStatus::Failed
                                })
                            }
                        } else if with_webauthn.is_some() {
                            Ok(LoginStatusReponse {
                                user: Some(user.clone()),
                                status: LoginStatus::TwoFactorRequired
                            })
                        } else {
                            Ok(LoginStatusReponse {
                                user: Some(user.clone()),
                                status: LoginStatus::Success
                            })
                        }
                    } else {
                        Ok(LoginStatusReponse {
                            user: Some(user.clone()),
                            status: LoginStatus::Success
                        })
                    }
                } else {
                    Ok(LoginStatusReponse {
                        user: None,
                        status: LoginStatus::UnknownUser
                    })
                }
            }
            Err(_) => Err(Status::InternalServerError),
        };
    } else {
        Err(Status::BadRequest)
    }
}

pub fn check_otp(data: &WithOTP, user: &User) -> bool {
    if user.otpkey.is_some() {
        let totp = make_totp(user.otpkey.as_ref().unwrap(), 30, -5);
        match totp {
            Ok(processed_code) => {
                data.code == processed_code
            },
            Err(_) => {
                false
            },
        }
    } else {
        false
    }
}

/// start_login_session - POST /login
#[post("/login", data = "<data>")]
pub fn start_login_session(
    conn: ScarletDB,
    data: Json<LoginDataPost>,
) -> Result<Json<LoginStatusReponse>, Status> {
    match do_user_login(data.0, conn) {
        Ok(user) => Ok(Json(user)),
        Err(err) => Err(err),
    }
}
