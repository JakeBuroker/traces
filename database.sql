CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role INTEGER DEFAULT 1 NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(200),
    verification_photo VARCHAR(200),
    video_watched BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    pronouns VARCHAR(200),
    reset_code VARCHAR(100)
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
    aws_key VARCHAR(200),
    date_posted TIMESTAMP DEFAULT NOW(),
    user_id INTEGER NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    media_type INTEGER,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (media_type) REFERENCES media(id)
);

CREATE TABLE IF NOT EXISTS project_settings (
    id SERIAL PRIMARY KEY,
    setting_name VARCHAR(100) NOT NULL,
    setting_value VARCHAR(100) NOT NULL
);

INSERT INTO project_settings (setting_name, setting_value) VALUES
('register_enabled', 'true'),
('upload_enabled', 'true'); -- may add more settings later

INSERT INTO "media" ("type")
VALUES ('text'),
('image'),
('video'),
('audio');


ALTER TABLE "user" ADD IF NOT EXISTS pronouns VARCHAR(200);
ALTER TABLE "user" ADD IF NOT EXISTS reset_code VARCHAR(100);

-- migrating data to json
COPY (SELECT json_agg(row_to_json(t)) FROM evidence t) TO '/Users/Gavin/Documents/Prime/TierThree/Client_Project/Traces/server/table/evidence.json';
COPY (SELECT json_agg(row_to_json(t)) FROM media t) TO '/Users/Gavin/Documents/Prime/TierThree/Client_Project/Traces/server/table/media.json';
COPY (SELECT json_agg(row_to_json(t)) FROM user t) TO '/Users/Gavin/Documents/Prime/TierThree/Client_Project/Traces/server/table/user.json';

