use crate::database::schema::users;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Queryable, Identifiable, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub private: bool,
    pub roles: i32,
    pub ban: Option<String>,
    pub avatar: String,
    pub a2f: bool,
    pub otpkey: Option<String>,
    pub updated_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "users"]
pub struct UserUpdate {
    pub username: Option<String>,
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
