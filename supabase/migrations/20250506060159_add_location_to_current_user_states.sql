DROP TABLE IF EXISTS current_tracks;

-- Create a dedicated separate schema
create schema if not exists "gis";
-- Example: enable the "postgis" extension
create extension postgis with schema "gis";

-- Enable usage of the "gis" schema for all roles; // TODO: this follows same pattern supabase GUI did for public schema but i should rlly look into this 
GRANT USAGE ON SCHEMA "gis" TO "postgres";
GRANT USAGE ON SCHEMA "gis" TO "anon";
GRANT USAGE ON SCHEMA "gis" TO "authenticated";
GRANT USAGE ON SCHEMA "gis" TO "service_role";

CREATE TABLE current_user_states (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_track_id TEXT,
    track_name TEXT,
    artist_name TEXT,
    album_name TEXT,
    album_image_url TEXT,
    location gis.geography(POINT) NOT NULL,
    is_playing BOOLEAN DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE OR REPLACE TRIGGER "update_current_user_states_updated_at" BEFORE UPDATE ON current_user_states FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Index to speed up queries that filter by location
CREATE INDEX current_user_states_geo_index
  ON public.current_user_states
  USING GIST (location);

-- Fetch user state given id
CREATE OR REPLACE FUNCTION get_user_state(user_id uuid)
RETURNS TABLE (
    id UUID,
    current_track_id TEXT,
    track_name TEXT,
    artist_name TEXT,
    album_name TEXT,
    album_image_url TEXT,
    is_playing BOOLEAN,
    longitude float,
    latitude float,
    updated_at timestamptz
)
SET search_path = 'public'
LANGUAGE sql
AS $$
    SELECT 
        id,
        current_track_id,
        track_name,
        artist_name,
        album_name,
        album_image_url,
        is_playing,
        gis.st_x(location::gis.geometry) as longitude, -- typecast from geography to geometry in following with docs
        gis.st_y(location::gis.geometry) as latitude,
        updated_at
    FROM current_user_states
    WHERE id = user_id;
$$;

-- Public View: Get nearby user states within a given radius // TODO: test
CREATE OR REPLACE FUNCTION get_nearby_user_states(
    user_id UUID,
    longitude float,
    latitude float,
    radius_miles float DEFAULT 1, -- Match Default to frontend, for now it's 1 mile
    max_results int DEFAULT 50 -- Match Default to frontend, for now it's 50
)
RETURNS TABLE (
    id UUID,
    current_track_id TEXT,
    track_name TEXT,
    artist_name TEXT,
    album_name TEXT,
    album_image_url TEXT,
    is_playing BOOLEAN,
    longitude float,
    latitude float,
    updated_at timestamptz,
    display_name TEXT,
    profile_image_url TEXT
)
SET search_path = 'public'
LANGUAGE sql
AS $$
    SELECT 
        cus.id,
        cus.current_track_id,
        cus.track_name,
        cus.artist_name,
        cus.album_name,
        cus.album_image_url,
        cus.is_playing,
        gis.st_x(location::gis.geometry) as longitude, -- typecast from geography to geometry in following with docs
        gis.st_y(location::gis.geometry) as latitude,
        cus.updated_at,
        user_profiles.display_name,
        user_profiles.profile_image_url
    FROM current_user_states cus
    INNER JOIN user_profiles ON cus.id = user_profiles.id -- To add display name and profile image url to response
    WHERE gis.st_dwithin( -- Useful for radius queries
        location::gis.geography, 
        gis.st_point(longitude, latitude)::gis.geography, 
        radius_miles * 1609.34 -- Convert miles to meters as it's expected by ST_DWithin
    )
    AND user_profiles.privacy_level = 'everyone' -- Only show users who set their privacy level to everyone
    AND cus.id != user_id -- Don't show the current user in results
    ORDER BY location operator(gis.<->) gis.st_point(longitude, latitude)::gis.geography
    LIMIT max_results;
$$;

-- Friends View: Get all user_states of a given user's friends
CREATE OR REPLACE FUNCTION get_friends_user_states(
    longitude float,
    latitude float,
    user_id UUID,
    max_results int DEFAULT 50 -- TODO: match default to frontend - maybe unlimited?
)
RETURNS TABLE (
    id UUID,
    current_track_id TEXT,
    track_name TEXT,
    artist_name TEXT,
    album_name TEXT,
    album_image_url TEXT,
    is_playing BOOLEAN,
    longitude float,
    latitude float,
    updated_at timestamptz
)
SET search_path = 'public'
LANGUAGE sql
AS $$
    SELECT 
        cus.id,
        cus.current_track_id,
        cus.track_name,
        cus.artist_name,
        cus.album_name,
        cus.album_image_url,
        cus.is_playing,
        gis.st_x(location::gis.geometry) as longitude,
        gis.st_y(location::gis.geometry) as latitude,
        cus.updated_at
    FROM current_user_states cus
    INNER JOIN connections ON  -- The user (user_id) must be following users (id) they want to see on the map and also be their close friends!
        connections.follower_id = user_id AND 
        connections.followed_id = cus.id AND 
        connections.is_close_friend = TRUE
    WHERE connections.request_status = 'accepted'
    ORDER BY cus.location operator(gis.<->) gis.st_point(longitude, latitude)::gis.geography
    LIMIT max_results;
$$;
