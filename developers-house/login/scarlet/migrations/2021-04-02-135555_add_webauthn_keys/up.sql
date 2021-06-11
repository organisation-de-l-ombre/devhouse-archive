CREATE TABLE webauthn_keys (
    id uuid NOT NULL,
    user_id uuid NOT NULL,

    credential_id varchar NOT NULL,
    public_key   bytea  NOT NULL,

    updated_at Timestamptz DEFAULT NULL,
    created_at Timestamptz NOT NULL DEFAULT NOW(),
        PRIMARY KEY(id),
            CONSTRAINT fk_links
            FOREIGN KEY (user_id)
            REFERENCES users(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
)

