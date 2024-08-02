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
    verified BOOLEAN DEFAULT FALSE
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

DROP TABLE "user", evidence, media;

INSERT INTO "media" ("type")
VALUES ('text'),
('image'),
('video'),
('audio');

