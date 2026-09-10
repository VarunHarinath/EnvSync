ALTER TABLE users ALTER COLUMN permissions SET DEFAULT '{"read":true,"write":true,"can_pull_secrets":false}';
UPDATE users SET permissions = jsonb_set(permissions, '{write}', 'true') WHERE role = 'USER';
CREATE TABLE IF NOT EXISTS resource_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type varchar(20) NOT NULL CHECK(resource_type IN ('project','environment','secret')),
  resource_id uuid NOT NULL,
  shared_with uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission varchar(10) NOT NULL CHECK(permission IN ('READ','WRITE')),
  shared_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(resource_type, resource_id, shared_with)
);
CREATE INDEX IF NOT EXISTS resource_shares_recipient_idx ON resource_shares(shared_with, resource_type, resource_id);
