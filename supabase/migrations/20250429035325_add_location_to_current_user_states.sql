DROP TABLE IF EXISTS current_tracks;


CREATE TABLE current_user_states (
    user_id TEXT REFERENCES users(spotify_id) PRIMARY KEY,
    current_track_id TEXT,
    track_name TEXT,
    artist_name TEXT,
    album_name TEXT,
    album_image_url TEXT,
    latitude DECIMAL(8, 6),    -- 0-90, 6 values after decimal point
    longitude DECIMAL(9, 6),   -- 0-180, 6 values after decimal point
    is_playing BOOLEAN DEFAULT false,
    last_updated TIMESTAMPTZ DEFAULT now()
);