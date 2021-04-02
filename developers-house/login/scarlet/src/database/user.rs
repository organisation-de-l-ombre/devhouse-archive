use chrono::NaiveDateTime;
use uuid::Uuid;
use crate::database::schema::users;
use serde::{Serialize, Deserialize};

#[derive(Queryable, Identifiable, Serialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub private: bool,
    pub roles: i32,
    pub ban: Option<String>,
    pub updated_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime
}

#[derive(AsChangeset, Deserialize)]
#[table_name="users"]
pub struct UserUpdate {
    pub username: Option<String>,
    pub private: Option<bool>,
    pub ban: Option<Option<String>>,
    pub roles: Option<i32>
}

#[derive(Insertable)]
#[table_name="users"]
pub struct NewUser<'a> {
    pub id: &'a Uuid,
    pub username: &'a str,
    pub private: &'a bool,
}