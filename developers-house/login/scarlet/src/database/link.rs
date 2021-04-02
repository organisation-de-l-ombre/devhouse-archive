use uuid::Uuid;
use chrono::NaiveDateTime;
use crate::schema::links;
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