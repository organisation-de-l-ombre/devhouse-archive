/// start_login_session - POST /login
/// Creates a login session, used to complete
/// the login flow, if the request is successful,
/// the complete flag will be true, in the other
/// case, a login session_id will be assigned and
/// used to validate the request using other login
/// methods.
#[post("/login")]
pub fn start_login_session () {

}

/// get_login_session - GET /login/:id
/// Get a login session by session_id
#[get("/login/<id>")]
pub fn get_login_session () {

}

/// post_to_login_session - POST /login/:id
/// Add a login validation to the login session
/// using the session_id.
#[post("/login/<id>")]
pub fn post_to_login_session () {

}
