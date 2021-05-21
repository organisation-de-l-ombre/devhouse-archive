#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate rocket_contrib;
extern crate serde;

use crate::database::establish_connection;
use dotenv::dotenv;
use rocket::config::{Environment, Value};
use rocket::{Rocket};
use std::collections::HashMap;
use std::env;

mod api;
mod database;
mod types;

embed_migrations!();

#[database("scarlet_db")]
pub struct ScarletDB(rocket_contrib::databases::diesel::PgConnection);

macro_rules! map(
    { $($key:expr => $value:expr),+ } => {
        {
            let mut m = ::std::collections::HashMap::new();
            $(
                m.insert($key, $value);
            )+
            m
        }
     };
);

fn rocket() -> Rocket {
    let postgres_url = format!(
        "postgres://{}:{}@{}:{}/{}",
        env::var("POSTGRES_USERNAME").expect("You need a POSTGRES_USERNAME."),
        env::var("POSTGRES_PASSWORD").expect("You need a POSTGRES_PASSWORD."),
        env::var("POSTGRES_HOST").expect("You need a POSTGRES_HOST."),
        env::var("POSTGRES_PORT").expect("You need a POSTGRES_PORT."),
        env::var("POSTGRES_DATABASE").expect("You need a POSTGRES_DATABASE.")
    );

    let scarlet_db_config: HashMap<_, Value> = map! {
        "url" => postgres_url.into()
    };

    let figment = rocket::Config::build(Environment::Production)
        .extra(
            "databases",
            map! {
                "scarlet_db" => scarlet_db_config
            },
        )
        .finalize()
        .unwrap();

    rocket::custom(figment)
}


fn main() {
    dotenv().ok();
    let con = establish_connection();
    embedded_migrations::run(&con).unwrap();

    rocket()
        .attach(ScarletDB::fairing())
        .mount(
            "/",
            routes![
                api::health::health,
                api::links::delete_link_for_user,
                api::links::get_user_links_by_id,
                api::links::put_link_for_id,
                api::user::delete_user_by_id,
                api::user::get_user_by_id,
                api::user::patch_user_by_id,
                api::user::post_user,
                api::webauthn::delete_webauthn_for_user,
                api::webauthn::put_webauth_key,
                api::webauthn::get_webauth_keys_for_user,
                api::statistics::get_statistics,
                api::login::start_login_session,
            ],
        )
        .launch();
}
