-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  role INTEGER DEFAULT 1,
  full_name VARCHAR(100) NOT NULL,
  alias VARCHAR(100),
  avatar_url VARCHAR(200),
  waiver_acknowledged BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  type VARCHAR(200)
);
CREATE TABLE IF NOT EXISTS evidence (
  id SERIAL PRIMARY KEY,
  location VARCHAR(100) DEFAULT 'Minneapolis',
  title TEXT NOT NULL,
  notes TEXT,
  aws_key VARCHAR(200) NOT NULL,
  date_posted TIMESTAMP DEFAULT NOW(),
  user_id INTEGER NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  media_type INTEGER,
  FOREIGN KEY (user_id) REFERENCES "user"(id),
  FOREIGN KEY (media_type) REFERENCES media(id)
);
