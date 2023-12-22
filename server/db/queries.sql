CREATE DATABASE fav_map_locations;

-- Enable the uuid_generate_v4() function 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
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

-- Favorited places
CREATE TABLE places (
  place_id VARCHAR(255) PRIMARY KEY,
  user_id uuid REFERENCES users(user_id) NOT NULL,
  place_name VARCHAR(255) NOT NULL, -- Can be an empty string if the OSMPlace only has the address
  place_address VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  photo_urls JSONB[] DEFAULT ARRAY[]::JSONB[] NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a new favorite place
INSERT INTO places (place_id, user_id, place_name, place_address, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6);

-- Get a specific favorite place
SELECT * FROM places WHERE place_id = $1;

-- Get one or more favorites
SELECT * FROM places WHERE place_id = ANY($1);

-- Remove a favorite
DELETE FROM places WHERE place_id = 'your_place_id' AND user_id = 'your_user_id';

-- Favorited place photos
CREATE TABLE photos (
  photo_file_key VARCHAR(255) PRIMARY KEY, 
  place_id VARCHAR(255) REFERENCES places(place_id) NOT NULL, 
  user_id uuid REFERENCES users(user_id) NOT NULL, 
  upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a photo
INSERT INTO photos (photo_file_key, place_id, user_id) VALUES ($1, $2, $3);

