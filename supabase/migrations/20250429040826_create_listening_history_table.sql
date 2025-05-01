CREATE TABLE listening_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES users(spotify_id),
    track_id TEXT,
    track_name TEXT,
    artist_name TEXT,
    album_name TEXT,
    album_image_url TEXT,
    latitude DECIMAL(8, 6),    -- 0-90, 6 values after decimal point
    longitude DECIMAL(9, 6),   -- 0-180, 6 values after decimal point
    played_at TIMESTAMPTZ DEFAULT now()
);