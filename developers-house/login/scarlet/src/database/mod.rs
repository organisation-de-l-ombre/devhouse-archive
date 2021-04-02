use diesel::{PgConnection, Connection};
use std::env;
use dotenv::dotenv;

pub mod user;
pub mod link;
pub mod schema;
pub mod webauth_key;

pub fn establish_connection () -> PgConnection {
    dotenv().ok();

    let url = format!("postgres://{}:{}@{}:{}/{}?sslmode=prefer",
        env::var("POSTGRES_USERNAME").expect("You need a POSTGRES_USERNAME."),
        env::var("POSTGRES_PASSWORD").expect("You need a POSTGRES_PASSWORD variable."),
        env::var("POSTGRES_HOST").expect("You need a POSTGRES_HOST."),
        env::var("POSTGRES_PORT").expect("You need a POSTGRES_PORT."),
        env::var("POSTGRES_DATABASE").expect("You need a POSTGRES_DATABASE.")
    );

    PgConnection::establish(&url)
        .expect(&format!("Failed to connect to the specified database {}", url))
}