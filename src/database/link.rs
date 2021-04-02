use uuid::Uuid;
use chrono::NaiveDateTime;
use crate::database::schema::links;
use serde::{Serialize};

#[derive(Associations, Identifiable, Queryable, Serialize)]
#[belongs_to(users, foreign_key=user_id)]
pub struct Link {
    pub id: Uuid,
    pub platform: String,
    pub platform_id: String,
    pub user_id: Uuid,
    pub updated_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime
}

#[derive(Insertable)]
#[table_name="links"]
pub struct NewLink<'a> {
    pub id: &'a Uuid,
    pub platform: &'a String,
    pub platform_id: &'a String,
    pub user_id: &'a Uuid,
}