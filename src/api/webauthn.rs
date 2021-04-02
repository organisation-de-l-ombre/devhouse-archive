use rocket_contrib::uuid::Uuid;

/// get_webauth_keys_for_user - GET /user/:id/webauth
/// Get all the linked webauthn keys available for the user.
#[get("/user/<user>/webauth")]
pub fn get_webauth_keys_for_user (user: Uuid) {

}

/// put_webauth_key - PUT /user/:id/webauth
/// Creates a new webauthn key for the user.
#[put("/user/<user>/webauth")]
pub fn put_webauth_key (user: Uuid) {

}

/// delete_webauthn_for_user - DELETE /user/:user/webauth/:key
/// Deletes a linked key of the account.
#[delete("/user/<user>/webauth/<id>")]
pub fn delete_webauthn_for_user (user: Uuid, id: Uuid) {

}