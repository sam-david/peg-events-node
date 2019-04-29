CREATE TABLE events (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  created_at  TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);
