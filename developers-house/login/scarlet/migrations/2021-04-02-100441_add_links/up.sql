CREATE TABLE links (
    id uuid NOT NULL,
    platform VARCHAR(25) NOT NULL,
    platform_id VARCHAR(50) NOT NULL,
    user_id uuid NOT NULL,
    updated_at Timestamptz DEFAULT NULL,
    created_at Timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY(id),
        CONSTRAINT fk_links
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
)

