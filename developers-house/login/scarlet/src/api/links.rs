use rocket_contrib::uuid::Uuid;
use crate::database::schema::links::dsl::{links, user_id, id};
use diesel::{QueryDsl, ExpressionMethods};
use crate::database::link::{Link, NewLink};
use diesel::result::Error;
use crate::database::establish_connection;
use crate::diesel::RunQueryDsl;
use rocket_contrib::json::Json;
use rocket::http::Status;

/// get_user_links_by_id - GET /user/:id/links
/// This endpoint return all the linked accounts
/// on the user's account.
#[get("/user/<user>/links")]
pub fn get_user_links_by_id (user: Uuid) -> Result<Json<Vec<Link>>, Status> {
    let conn = establish_connection();

    let link: Result<Vec<Link>, Error> = links
        .filter(user_id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap()))
        .load::<Link>(&conn);

    match link {
        Ok(data) => {
            Ok(Json(data))
        }
        Err(_) => {
            Err(Status::InternalServerError)
        }
    }
}

/// put_link_for_id - PUT /user/:id/links
/// Create a linked account on the user account.
#[put("/user/<user>/links", data = "<data>")]
pub fn put_link_for_id (user: Uuid, data: Json<NewLink>) -> Status {
    let uuid = uuid::Uuid::new(uuid::UuidVersion::Random).unwrap();
    let conn = establish_connection();
    let new_platform = data.clone();
    match diesel::insert_into(links)
        .values(&NewLink{
            id: uuid,
            platform: new_platform.platform,
            platform_id: new_platform.platform_id,
            user_id: uuid::Uuid::from_bytes(user.as_bytes()).unwrap(),
        })
        .execute(&conn) {
        Ok(_) => { Status::Created }
        Err(_) => { Status::InternalServerError }
    }
}

/// delete_link_for_user - DELETE /user/:user/links/:link
/// Delete a linked account on the user account.
#[delete("/user/<user>/links/<link>")]
pub fn delete_link_for_user (user: Uuid, link: Uuid) -> Status {
    let user = uuid::Uuid::from_bytes(user.as_bytes()).unwrap();
    let link = uuid::Uuid::from_bytes(link.as_bytes()).unwrap();
    let conn = establish_connection();

    match diesel::delete(links)
        .filter(id.eq(link))
        .filter(user_id.eq(user))
        .execute(&conn) {
        Ok(_) => { Status::Accepted }
        Err(_) => { Status::InternalServerError }
    }
}

/// get_link_by_id - GET /link/:id
/// Get a link information by id.
#[get("/link/<link_id>")]
pub fn get_link_by_id (link_id: Uuid) -> Result<Json<Link>, Status> {
    let conn = establish_connection();
    let link = uuid::Uuid::from_bytes(link_id.as_bytes()).unwrap();
    match links.filter(id.eq(link)).first(&conn) {
        Ok(e) => {
            Ok(Json(e))
        }
        Err(_) => { Err(Status::NotFound) }
    }
}