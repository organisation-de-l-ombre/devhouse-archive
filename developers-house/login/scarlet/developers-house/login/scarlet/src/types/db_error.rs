use diesel::result::Error;
use rocket::http::Status;

pub fn db_error(error: Error) -> Status {
    match error {
        Error::NotFound => Status::NotFound,
        _ => Status::InternalServerError
    }
}
