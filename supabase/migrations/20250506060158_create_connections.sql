CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE connection_request_type AS ENUM ('follow', 'close_friend', 'upgrade_to_close_friend');

CREATE TABLE connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    request_type connection_request_type NOT NULL,
    request_status connection_status NOT NULL DEFAULT 'pending',
    is_close_friend BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT unique_relationship UNIQUE (follower_id, followed_id) -- so that a user can't follow the same user twice
);

CREATE OR REPLACE TRIGGER "update_connections_updated_at" BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();