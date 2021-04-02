use rocket_contrib::uuid::Uuid;

/// get_user_links_by_id - GET /user/:id/links
/// This endpoint return all the linked accounts
/// on the user's account.
#[get("/user/<user>/links")]
pub fn get_user_links_by_id (user: Uuid) {

}

/// put_link_for_id - PUT /user/:id/links
/// Create a linked account on the user account.
#[put("/user/<user>/links")]
pub fn put_link_for_id (user: Uuid) {

}

/// delete_link_for_user - DELETE /user/:user/links/:link
/// Delete a linked account on the user account.
#[delete("/user/<user>/links/<link>")]
pub fn delete_link_for_user (user: Uuid, link: Uuid) {

}

/// get_link_by_id - GET /link/:id
/// Get a link information by id.
#[get("/link/<link_id>")]
pub fn get_link_by_id (link_id: Uuid) {

}