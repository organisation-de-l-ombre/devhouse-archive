use crate::database::schema::users;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use serde;

#[derive(Queryable, Identifiable, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    #[serde(rename = "pub")]
    pub private: bool,
    pub roles: i32,
    pub ban: Option<String>,
    pub avatar: String,
    pub a2f: bool,
    #[serde(skip_serializing)]
    pub otpkey: Option<String>,
    pub updated_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "users"]
pub struct UserUpdate {
    pub username: Option<String>,
    #[serde(rename = "pub")]
    pub private: Option<bool>,
    pub ban: Option<Option<String>>,
    pub roles: Option<i32>,
    pub twofa: Option<bool>,
    pub avatar: Option<String>,
}

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub id: &'a Uuid,
    pub username: &'a str,
    pub private: &'a bool,
    pub avatar: &'a String,
}

#[derive(AsChangeset, Serialize)]
#[table_name = "users"]
pub struct UserOtpKeyUpdate {
    pub otpkey: Option<String>,
}