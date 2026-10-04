-- Existing installations retain Business capabilities; no automatic profile conversion.
ALTER TABLE instance_settings ADD COLUMN profile text NOT NULL DEFAULT 'business' CHECK (profile IN ('personal','business'));
ALTER TABLE instance_settings ADD COLUMN mcp_enabled boolean NOT NULL DEFAULT true;
ALTER TABLE instance_settings ADD COLUMN owner_user_id uuid REFERENCES users(id);
ALTER TABLE instance_settings ADD CONSTRAINT personal_requires_owner CHECK (profile <> 'personal' OR owner_user_id IS NOT NULL);
