use uuid::Uuid;
use chrono::NaiveDateTime;
use serde::{Serialize};
use crate::database::schema::webauthn_keys;

#[derive(Associations, Identifiable, Queryable, Serialize)]
#[belongs_to(users, foreign_key=user_id)]
#[table_name="webauthn_keys"]
pub struct WebAuthKey {
    pub id: Uuid,
    pub user_id: Uuid,
    pub credential_id: String,
    pub public_key: Vec<u8>,
    pub updated_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime
}