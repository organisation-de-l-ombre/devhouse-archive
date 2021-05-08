use crate::database::link::Link;
use crate::database::schema::links::dsl::{links, platform, platform_id};
use crate::database::schema::users::dsl::users;
use crate::database::user::User;
use crate::diesel::RunQueryDsl;
use crate::types::ScarletError;
use crate::ScarletDB;
use diesel::associations::HasTable;
use diesel::result::Error;
use diesel::{BoolExpressionMethods, ExpressionMethods, JoinOnDsl, QueryDsl};
use otp::make_totp;
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};

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
pub struct ScarletResponse {
    code: u32,
    user: User,
}

pub fn do_user_login(data: LoginDataPost, db: ScarletDB) -> Result<ScarletResponse, ScarletError> {
    let with_otp = data.with_otp.as_ref();
    let with_platform = data.with_platform.as_ref();
    let with_webauthn = data.with_webauthn.as_ref();

    if with_platform.is_some() {
        let q_plat = with_platform.unwrap();
        let rec_link: Result<Vec<(User, Option<Link>)>, Error> = users
            .left_join(
                links::table().on(platform
                    .eq(&q_plat.platform_name)
                    .and(platform_id.eq(&q_plat.platform_id))),
            )
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
                        return Err(ScarletError {
                            code: 0x01,
                            message: "Cannot login using this account: This user is banned."
                                .to_string(),
                        });
                    }

                    if user.a2f && (user.otpkey.is_some()) {
                        if with_otp.is_some() {
                            if check_otp(with_otp.unwrap(), user) {
                                Ok(ScarletResponse {
                                    code: 200,
                                    user: user.clone()
                                })
                            } else {
                                Err(ScarletError {
                                    code: 0x02,
                                    message: "Cannot login using this TOTP: Invalid TOTP code."
                                        .to_string(),
                                })
                            }
                        } else if with_webauthn.is_some() {
                            Err(ScarletError {
                                code: 0x99,
                                message: "Webauthn is not implemented.".to_string(),
                            })
                        } else {
                            Ok(ScarletResponse {
                                code: 0x04,
                                user: user.clone(),
                            })
                        }
                    } else {
                        Ok(ScarletResponse {
                            code: 200,
                            user: user.clone()
                        })
                    }
                } else {
                    Err(ScarletError {
                        code: 0x05,
                        message: "This user does not exists.".to_string(),
                    })
                }
            }
            Err(_) => Err(ScarletError {
                code: 0x06,
                message: "Internal error.".to_string(),
            }),
        };
    } else {
        Err(ScarletError {
            code: 0x7,
            message: "No login platform specified.".to_string(),
        })
    }
}

pub fn check_otp(data: &WithOTP, user: &User) -> bool {
    if user.otpkey.is_some() {
        let totp = make_totp(user.otpkey.as_ref().unwrap(), 30, 30);
        match totp {
            Ok(processed_code) => {
                println!("Expected code {}", processed_code);
                data.code == processed_code
            },
            Err(_) => {
                println!("Failed.");
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
) -> Result<Json<ScarletResponse>, Json<ScarletError>> {
    match do_user_login(data.0, conn) {
        Ok(user) => Ok(Json(user)),
        Err(err) => Err(Json(err)),
    }
}
