CREATE TABLE users (
  id uuid NOT NULL PRIMARY KEY,
  username VARCHAR NOT NULL,
  private BOOLEAN NOT NULL DEFAULT false,
  roles INTEGER NOT NULL DEFAULT 0,
  ban TEXT DEFAULT NULL,
  avatar VARCHAR NOT NULL,
  twofa BOOLEAN NOT NULL DEFAULT false,
  otpkey varchar DEFAULT NULL,
  updated_at Timestamptz DEFAULT NULL,
  created_at Timestamptz NOT NULL DEFAULT NOW()
)