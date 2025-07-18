use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ScarletError {
    pub code: i64,
    pub message: String,
}
pub mod db_error;