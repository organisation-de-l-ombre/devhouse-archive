use diesel::{PgConnection, Connection};
use std::env;
use dotenv::dotenv;

pub mod user;
pub mod link;
// pub mod link;

pub fn establish_connection () -> PgConnection {
    dotenv().ok();
    let database = env::var("DATABASE_URL")
        .expect("You must specify a database url");
    PgConnection::establish(&database)
        .expect(&format!("Failed to connect to the specified database {}", database))
}