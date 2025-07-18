use rocket::http::Status;

/// health - GET /_healz
/// Always returns true if the server is up and running.
/// Used by the kubernetes health checksto check if the
/// service is alive.
#[get("/_healz")]
pub fn health() -> Status {
    Status::Accepted
}
