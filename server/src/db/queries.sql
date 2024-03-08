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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a new favorite place
INSERT INTO places (place_id, user_id, place_name, place_address, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6);

-- Get a specific favorite place
SELECT * FROM places WHERE place_id = $1;

-- Get one or more favorites
SELECT * FROM places WHERE place_id = ANY($1);

-- Remove a favorite
DELETE FROM places WHERE place_id = 'your_place_id';

-- Favorited place photos
CREATE TABLE photos (
  photo_file_key VARCHAR(255) PRIMARY KEY, 
  place_id VARCHAR(255) REFERENCES places(place_id) NOT NULL ON DELETE CASCADE, 
  user_id uuid REFERENCES users(user_id) NOT NULL, 
  upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a photo
INSERT INTO photos (photo_file_key, place_id, user_id) VALUES ($1, $2, $3);

-- Get photos for a specific place
SELECT * FROM photos WHERE place_id = $1;

-- Ratings Table
CREATE TABLE ratings (
  rating_id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES users(user_id) NOT NULL,
  place_id VARCHAR(255) REFERENCES favorites(place_id) NOT NULL ON DELETE CASCADE,
  rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
  CONSTRAINT ratings_user_id_place_id_unique UNIQUE (user_id, place_id) -- For the ON CONFLICT clause below
);

-- Add or update a place rating
INSERT INTO ratings (user_id, place_id, rating_value)
VALUES ($1, $2, $3)
ON CONFLICT (user_id, place_id)
DO UPDATE SET rating_value = EXCLUDED.rating_value;

-- Average place rating and place details view
-- AVG() first calculates the average, 
-- COALESCE converts any unrated place with a value of NULL to the number 0,
-- and CAST converts the resulting string as the number into an actual number
CREATE VIEW place_with_average_rating AS
SELECT
  p.place_id,
  p.user_id,
  p.place_name,
  p.place_address,
  p.latitude,
  p.longitude,
  p.created_at,
  CAST(COALESCE(AVG(r.rating_value), 0) AS DOUBLE PRECISION) AS average_rating
FROM
  places p
LEFT JOIN
  ratings r ON p.place_id = r.place_id
GROUP BY
  p.place_id, p.place_name, p.place_address, p.latitude, p.longitude, p.created_at;

-- Query place details, average place rating, username of the user who favorited the location,
-- and the user's own rating of the place
SELECT 
  pv.*,
  u.username AS creator_username,
  COALESCE(r.rating_value, 0) AS user_rating
FROM 
  place_with_average_rating pv
JOIN
  places p ON pv.place_id = p.place_id
LEFT JOIN
  users u ON p.user_id = u.user_id
LEFT JOIN 
  ratings r ON pv.place_id = r.place_id AND r.user_id = $1
WHERE 
  pv.place_id = $2;

-- Get places within the user's visible current bounding box rectangular area view of the map
-- First filter out places within the bounding box and then order them by the distance
-- from the center point of the view so places are somewhat evenly distributed and not all
-- clustered densely around the center point. Note that this basic mathematical approach is not
-- as accurate as using a professional geospatial extension like PostGIS, but is good enough
-- for the purposes of this app and demonstration. (Recommendation of ChatGPT)
-- $1: boundsCenterLat
-- $2: boundsCenterLng
-- $3: swLat
-- $4: neLat
-- $5: swLng
-- $6: neLng
-- $7: PLACES_QUERY_LIMIT
SELECT 
  p.*,
  ABS(p.latitude - $1) + ABS(p.longitude - $2) AS distance_from_center
FROM 
  place_with_average_rating p
WHERE 
  p.latitude BETWEEN $3 AND $4
  AND p.longitude BETWEEN $5 AND $6
ORDER BY 
  distance_from_center
LIMIT $7;

-- Stores all the place details page chat logs
CREATE TABLE chat_logs (
  chat_id VARCHAR(255) PRIMARY KEY,
  place_id VARCHAR(255) REFERENCES places(place_id) NOT NULL ON DELETE CASCADE, 
  chat_status INTEGER NOT NULL,
  content_type INTEGER NOT NULL,
  sender_id VARCHAR(255) NOT NULL, -- username
  direction INTEGER NOT NULL, -- 1 is incoming, 2 is outgoing
  content VARCHAR(255) NOT NULL,
  created_time TIMESTAMP NOT NULL,
);

-- Add a chat log
INSERT INTO chat_logs (chat_id, place_id, chat_status, content_type, sender_id, content, created_time)
VALUES ($1, $2, $3, $4, $5, $6, $7)

-- Paginated selecting of chat messages
SELECT * FROM chat_logs
WHERE place_id = $1
ORDER BY created_time ASC
LIMIT $2 OFFSET $3;
