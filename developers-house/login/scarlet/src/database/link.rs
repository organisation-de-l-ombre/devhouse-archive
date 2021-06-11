use crate::database::schema::links;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Associations, Identifiable, Queryable, Serialize)]
#[belongs_to(users, foreign_key=user_id)]
pub struct Link {
    pub id: Uuid,
    pub platform: String,
    pub platform_id: String,
    pub user_id: Uuid,
    pub updated_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable, Deserialize, Clone)]
#[table_name = "links"]
pub struct NewLink {
    #[serde(skip_deserializing)]
    pub id: Uuid,
    pub platform: String,
    pub platform_id: String,
    #[serde(skip_deserializing)]
    pub user_id: Uuid,
}
