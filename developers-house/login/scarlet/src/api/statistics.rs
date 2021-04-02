use serde::Serialize;
use crate::database::schema::users::dsl::users;
use diesel::QueryDsl;
use crate::database::establish_connection;
use rocket_contrib::json::Json;
use crate::diesel::RunQueryDsl;
use rocket::http::Status;
use crate::database::schema::links::dsl::links;
use crate::database::schema::webauthn_keys::dsl::webauthn_keys;

#[derive(Serialize)]
pub struct Statistics {
    user_count: i64,
    links_count: i64,
    webauth_count: i64,
    otp_count: i64,
}

#[get("/statistics")]
pub fn get_statistics () -> Result<Json<Statistics>, Status> {
    let conn = establish_connection();
    
    let mut statistics = Statistics { user_count: 0, links_count: 0, webauth_count: 0, otp_count: 0 };
    
    statistics.user_count = users
        .count()
        .first::<i64>(&conn)
        .unwrap();

    statistics.links_count = links
        .count()
        .first::<i64>(&conn)
        .unwrap();

    statistics.webauth_count = webauthn_keys
        .count()
        .first::<i64>(&conn)
        .unwrap();

    Ok(Json(statistics))
}