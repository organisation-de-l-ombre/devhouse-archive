table! {
    links (id) {
        id -> Uuid,
        platform -> Varchar,
        platform_id -> Varchar,
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
        avatar -> Varchar,
        a2f -> Bool,
        updated_at -> Nullable<Timestamptz>,
        created_at -> Timestamptz,
    }
}

table! {
    webauthn_keys (id) {
        id -> Uuid,
        user_id -> Uuid,
        credential_id -> Varchar,
        public_key -> Bytea,
        updated_at -> Nullable<Timestamptz>,
        created_at -> Timestamptz,
    }
}

allow_tables_to_appear_in_same_query!(links, users, webauthn_keys,);
