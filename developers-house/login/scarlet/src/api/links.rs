use crate::database::link::{Link, NewLink};
use crate::database::schema::links::dsl::{id, links, user_id};
use crate::diesel::RunQueryDsl;
use crate::ScarletDB;
use diesel::result::Error;
use diesel::{ExpressionMethods, QueryDsl};
use rocket::http::Status;
use rocket_contrib::json::Json;
use rocket_contrib::uuid::Uuid;

/// get_user_links_by_id - GET /user/:id/links
/// This endpoint return all the linked accounts
/// on the user's account.
#[get("/user/<user>/links")]
pub fn get_user_links_by_id(conn: ScarletDB, user: Uuid) -> Result<Json<Vec<Link>>, Status> {
    let link: Result<Vec<Link>, Error> = links
        .filter(user_id.eq(uuid::Uuid::from_bytes(user.as_bytes()).unwrap()))
        .load::<Link>(&*conn);

    match link {
        Ok(data) => Ok(Json(data)),
        Err(_) => Err(Status::InternalServerError),
    }
}

/// put_link_for_id - PUT /user/:id/links
/// Create a linked account on the user account.
#[put("/user/<user>/links", data = "<data>")]
pub fn put_link_for_id(conn: ScarletDB, user: Uuid, data: Json<NewLink>) -> Status {
    let uuid = uuid::Uuid::new(uuid::UuidVersion::Random).unwrap();
    let new_platform = data.clone();
    match diesel::insert_into(links)
        .values(&NewLink {
            id: uuid,
            platform: new_platform.platform,
            platform_id: new_platform.platform_id,
            user_id: uuid::Uuid::from_bytes(user.as_bytes()).unwrap(),
        })
        .execute(&*conn)
    {
        Ok(_) => Status::Created,
        Err(_) => Status::InternalServerError,
    }
}

/// delete_link_for_user - DELETE /user/:user/links/:link
/// Delete a linked account on the user account.
#[delete("/user/<user>/links/<link>")]
pub fn delete_link_for_user(conn: ScarletDB, user: Uuid, link: Uuid) -> Status {
    let user = uuid::Uuid::from_bytes(user.as_bytes()).unwrap();
    let link = uuid::Uuid::from_bytes(link.as_bytes()).unwrap();

    match diesel::delete(links)
        .filter(id.eq(link))
        .filter(user_id.eq(user))
        .execute(&*conn)
    {
        Ok(_) => Status::Accepted,
        Err(_) => Status::InternalServerError,
    }
}
