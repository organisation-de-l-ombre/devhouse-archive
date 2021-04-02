use rocket_contrib::uuid::Uuid;

/// get_user_by_id - GET /user/:id
/// Get a user information by id.
/// Returns 403 if the user is banned.
#[get("/user/<id>")]
pub fn get_user_by_id (id: Uuid) -> String {
    format!("Hello, {}!", id)
}

/// patch_user_by_id - PATCH /user/:id
/// Edits a user profile, only certain fields
/// can be edited.
#[patch("/user/<id>")]
pub fn patch_user_by_id (id: Uuid) {

}

/// delete_user_by_id - DELETE /user/:id
/// Deletes a user profile, DO NOT USE,
/// call the cryir service to handle this
/// kind of stuff.
#[delete("/user/<id>")]
pub fn delete_user_by_id (id: Uuid) {

}

/// post_user - POST /user
/// Creates a user profile using some preferences,
/// and a linked account.
#[post("/user")]
pub fn post_user () {

}