
CREATE TYPE privacy_level AS ENUM ('everyone', 'friends_only', 'nobody');

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    profile_image_url text,
    display_name text,
    bio text,
    privacy_level privacy_level DEFAULT 'friends_only',
    favorite_song text,
    favorite_artist text,
    favorite_album text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE OR REPLACE TRIGGER "update_user_profiles_updated_at" BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();