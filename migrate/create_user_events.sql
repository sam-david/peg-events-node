CREATE TABLE user_events (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER,
  event_id INTEGER,
  document_name VARCHAR(30),
  created_at  TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  event_at TIMESTAMP
);
