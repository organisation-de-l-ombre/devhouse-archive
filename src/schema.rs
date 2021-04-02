table! {
    links (id) {
        id -> Uuid,
        platform -> Varchar,
        platformid -> Varchar,
        user_id -> Uuid,
        updated_at -> Nullable<Timestamptz>,
        created_at -> Timestamptz,
    }
}

table! {
    users (id) {
        id -> Uuid,
        username -> Varchar,
        private -> Bool,
        roles -> Int4,
        ban -> Nullable<Text>,
        updated_at -> Nullable<Timestamptz>,
        created_at -> Timestamptz,
    }
}

joinable!(links -> users (user_id));

allow_tables_to_appear_in_same_query!(
    links,
    users,
);
