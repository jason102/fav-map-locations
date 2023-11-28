CREATE DATABASE fav_map_locations;

-- Enable the uuid_generate_v4() function 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(500),
  last_login TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Check if a user exists
SELECT * FROM users WHERE email = $1 OR username = $1;

-- Update the last_login timestamp
UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1;

-- Add a new user
INSERT INTO users (username, email, user_password, last_login) VALUES ($1, $2, $3, CURRENT_TIMESTAMP);
