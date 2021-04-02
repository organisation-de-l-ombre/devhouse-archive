#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate diesel;
#[macro_use] extern crate rocket;
#[macro_use] extern crate diesel_migrations;
extern crate serde;

use crate::database::establish_connection;

mod database;
mod api;


embed_migrations!();

fn main() {

    let con = establish_connection();
    embedded_migrations::run(&con);

    rocket::ignite().mount("/", routes![
        api::health::health,
        api::links::delete_link_for_user,
        api::links::get_link_by_id,
        api::links::get_user_links_by_id,
        api::links::put_link_for_id,
        api::user::delete_user_by_id,
        api::user::get_user_by_id,
        api::user::patch_user_by_id,
        api::user::post_user,
        api::webauthn::delete_webauthn_for_user,
        api::webauthn::put_webauth_key,
        api::webauthn::get_webauth_keys_for_user,
        api::statistics::get_statistics
    ]).launch();
}