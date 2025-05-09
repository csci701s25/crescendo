ALTER TABLE users
    -- This data will now be stored in provider_data
    DROP COLUMN IF EXISTS spotify_id,
    DROP COLUMN IF EXISTS email,
    DROP COLUMN IF EXISTS display_name,
    DROP COLUMN IF EXISTS profile_image_url,
    DROP COLUMN IF EXISTS access_token,
    DROP COLUMN IF EXISTS refresh_token,
    DROP COLUMN IF EXISTS token_expires_at;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS music_provider TEXT NOT NULL,
    ADD COLUMN IF NOT EXISTS music_provider_id TEXT NOT NULL,
    ADD COLUMN IF NOT EXISTS provider_data JSONB NOT NULL,
    ADD CONSTRAINT unique_music_provider_music_provider_id UNIQUE (music_provider, music_provider_id);


