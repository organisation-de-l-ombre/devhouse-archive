use crate::database::schema::webauthn_keys::dsl::{id, user_id, webauthn_keys};
use crate::database::webauth_key::{NewWebAuthnKey, WebAuthKey};
use crate::diesel::RunQueryDsl;
use crate::ScarletDB;
use diesel::result::Error;
use diesel::{ExpressionMethods, QueryDsl};
use rocket::http::Status;
use rocket_contrib::json::Json;
use rocket_contrib::uuid::Uuid;

/// get_webauth_keys_for_user - GET /user/:id/webauth
/// Get all the linked webauthn keys available for the user.
#[get("/user/<user>/webauth")]
pub fn get_webauth_keys_for_user(
    conn: ScarletDB,
    user: Uuid,
) -> Result<Json<Vec<WebAuthKey>>, Status> {
    let keys: Result<Vec<WebAuthKey>, Error> = webauthn_keys
        .filter(user_id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap()))
        .load::<WebAuthKey>(&*conn);

    match keys {
        Ok(result) => Ok(Json(result)),
        Err(_) => Err(Status::InternalServerError),
    }
}

/// put_webauth_key - PUT /user/:id/webauth
/// Creates a new webauthn key for the user.
#[put("/user/<user>/webauth", data = "<data>")]
pub fn put_webauth_key(data: Json<NewWebAuthnKey>, conn: ScarletDB, user: Uuid) -> Status {
    let uuid = uuid::Uuid::new(uuid::UuidVersion::Random).unwrap();
    let new_platform = data.clone();
    match diesel::insert_into(webauthn_keys)
        .values(&NewWebAuthnKey {
            id: uuid,
            user_id: uuid::Uuid::from_bytes(user.as_bytes()).unwrap(),
            credential_id: new_platform.credential_id,
            public_key: new_platform.public_key,
        })
        .execute(&*conn)
    {
        Ok(_) => Status::Created,
        Err(_) => Status::InternalServerError,
    }
}

/// delete_webauthn_for_user - DELETE /user/:user/webauth/:key
/// Deletes a linked key of the account.
#[delete("/user/<user>/webauth/<key>")]
pub fn delete_webauthn_for_user(conn: ScarletDB, user: Uuid, key: Uuid) -> Status {
    let user = uuid::Uuid::from_bytes(user.as_bytes()).unwrap();
    let key_id = uuid::Uuid::from_bytes(key.as_bytes()).unwrap();

    match diesel::delete(webauthn_keys)
        .filter(id.eq(key_id))
        .filter(user_id.eq(user))
        .execute(&*conn)
    {
        Ok(_) => Status::Accepted,
        Err(_) => Status::InternalServerError,
    }
}
