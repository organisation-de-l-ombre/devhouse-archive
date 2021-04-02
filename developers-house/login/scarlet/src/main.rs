#[macro_use]
extern crate diesel;
extern crate serde;

use crate::database::establish_connection;
use crate::database::link::Link;
use crate::database::user::User;
use crate::diesel::RunQueryDsl;
use crate::schema::links::dsl::{links, user_id};
use crate::schema::users::dsl::users;
use diesel::{ExpressionMethods, QueryDsl};

mod database;
mod schema;

fn main() {
    let con = establish_connection();
    let users_q: Vec<User> = users
        .limit(5)
        .load::<User>(&con)
        .expect("Failed to load posts");

    println!("Found {} users in the database", users_q.len());
    for user in users_q {
        println!(
            "User: {}",
            serde_json::to_string(&user).expect("Failed to serialize")
        );

        let links_q: Vec<Link> = links
            .filter(user_id.eq(user.id))
            .load::<Link>(&con)
            .expect("Failed to get links");

        for link in links_q {
            println!(
                "   Link: {}",
                serde_json::to_string(&link).expect("Failed to serialize.")
            )
        }
    }
}
