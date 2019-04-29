CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30),
  autodesk_id VARCHAR(30),
  autodesk_username VARCHAR(30),
  autodesk_displayname VARCHAR(30),
  created_at  TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  last_login_at TIMESTAMP
);
