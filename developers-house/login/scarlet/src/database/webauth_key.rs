use crate::database::schema::webauthn_keys;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Associations, Identifiable, Queryable, Serialize)]
#[belongs_to(users, foreign_key=user_id)]
#[table_name = "webauthn_keys"]
pub struct WebAuthKey {
    pub id: Uuid,
    pub user_id: Uuid,
    pub credential_id: String,
    #[serde(skip_serializing)]
    pub public_key: Vec<u8>,
    pub updated_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable, Deserialize, Clone)]
#[table_name = "webauthn_keys"]
pub struct NewWebAuthnKey {
    #[serde(skip_deserializing)]
    pub id: Uuid,
    #[serde(skip_deserializing)]
    pub user_id: Uuid,
    pub credential_id: String,
    pub public_key: Vec<u8>,
}
