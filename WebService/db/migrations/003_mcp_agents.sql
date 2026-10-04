CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name varchar(120),
  description varchar(500),
  status varchar(16) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','REVOKED')),
  client_name varchar(120) NOT NULL,
  client_version varchar(80),
  transport varchar(20) NOT NULL DEFAULT 'STDIO' CHECK (transport IN ('STDIO','HTTP')),
  machine_label varchar(160),
  enrollment_id uuid NOT NULL UNIQUE,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  rejected_at timestamptz,
  rejected_by uuid REFERENCES users(id) ON DELETE SET NULL,
  revoked_at timestamptz,
  revoked_by uuid REFERENCES users(id) ON DELETE SET NULL,
  last_seen_at timestamptz,
  last_activity_at timestamptz
);

CREATE TABLE IF NOT EXISTS agent_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  credential_hash char(64) NOT NULL UNIQUE,
  credential_prefix varchar(20) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE IF NOT EXISTS agent_environment_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  environment_id uuid NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
  access_level varchar(16) NOT NULL CHECK (access_level IN ('READ','READ_WRITE')),
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  granted_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  UNIQUE(agent_id, environment_id)
);

CREATE TABLE IF NOT EXISTS agent_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  environment_id uuid NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
  requested_access varchar(16) NOT NULL CHECK (requested_access IN ('READ','READ_WRITE')),
  reason varchar(500) NOT NULL,
  requested_duration_minutes integer NOT NULL CHECK (requested_duration_minutes BETWEEN 1 AND 10080),
  status varchar(16) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','DENIED','CANCELLED')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  expires_at timestamptz
);

ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_agent_id uuid REFERENCES agents(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS agents_status_idx ON agents(status);
CREATE INDEX IF NOT EXISTS agent_credentials_agent_idx ON agent_credentials(agent_id);
CREATE INDEX IF NOT EXISTS agent_access_agent_idx ON agent_environment_access(agent_id);
CREATE INDEX IF NOT EXISTS agent_access_environment_idx ON agent_environment_access(environment_id);
CREATE INDEX IF NOT EXISTS agent_requests_status_idx ON agent_access_requests(status, requested_at DESC);

UPDATE users SET permissions = permissions || '{"mcp_read":true,"mcp_write":true}'::jsonb WHERE role='ADMIN';
