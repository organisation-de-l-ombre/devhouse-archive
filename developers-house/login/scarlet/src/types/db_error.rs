use crate::types::ScarletError;
use diesel::result::Error;

pub fn db_error(error: Error) -> ScarletError {
    match error {
        Error::InvalidCString(_) => ScarletError {
            code: 0b1000001,
            message: "PGDB: InvalidCString".to_string(),
        },
        Error::DatabaseError(_, _) => ScarletError {
            code: 0b1000010,
            message: "PGDB: DatabaseError".to_string(),
        },
        Error::NotFound => ScarletError {
            code: 0b0000001,
            message: "REQ: Not found".to_string(),
        },
        Error::QueryBuilderError(_) => ScarletError {
            code: 0b1000011,
            message: "DIE: Query builder error".to_string(),
        },
        Error::DeserializationError(_) => ScarletError {
            code: 0b1000100,
            message: "DIE: Deserialization error".to_string(),
        },
        Error::SerializationError(_) => ScarletError {
            code: 0b1000101,
            message: "DIE: Serialization error".to_string(),
        },
        Error::RollbackTransaction => ScarletError {
            code: 0b1000110,
            message: "DIE: RollbackTransaction".to_string(),
        },
        Error::AlreadyInTransaction => ScarletError {
            code: 0b1000111,
            message: "DIE: RollbackTransaction".to_string(),
        },
        Error::__Nonexhaustive => ScarletError {
            code: 0b1001000,
            message: "DIE: __Nonexhaustive".to_string(),
        },
    }
}
