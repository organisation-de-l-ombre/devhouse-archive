use chrono::NaiveDateTime;
use uuid::Uuid;
use crate::database::schema::users;
use serde::{Serialize};

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

#[derive(AsChangeset)]
#[table_name="users"]
struct UserUpdate<'a> {
    pub username: Option<&'a str>,
    pub private: Option<&'a bool>,
    pub ban: Option<Option<&'a str>>,
    pub roles: Option<&'a i32>
}

#[derive(Insertable)]
#[table_name="users"]
struct NewUser<'a> {
    pub username: &'a str,
    pub private: &'a bool,
}