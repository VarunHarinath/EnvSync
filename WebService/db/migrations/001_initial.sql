CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS instance_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id), organization_name varchar(120) NOT NULL,
  instance_name varchar(120) NOT NULL, public_url text NOT NULL, support_email text,
  timezone varchar(80) NOT NULL DEFAULT 'UTC', registration_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), full_name varchar(120) NOT NULL, email varchar(320) NOT NULL,
  password_hash text NOT NULL, role varchar(20) NOT NULL DEFAULT 'USER' CHECK(role IN ('ADMIN','USER')),
  permissions jsonb NOT NULL DEFAULT '{"read":true,"write":false,"can_pull_secrets":false}',
  active boolean NOT NULL DEFAULT true, failed_login_count integer NOT NULL DEFAULT 0, locked_until timestamptz,
  last_login_at timestamptz, password_changed_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users(lower(email));
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL UNIQUE, expires_at timestamptz NOT NULL, revoked_at timestamptz, replaced_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(), ip inet, user_agent text
);
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(100) NOT NULL, description text,
  archived_at timestamptz, created_by uuid REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS projects_active_name_idx ON projects(lower(name)) WHERE archived_at IS NULL;
CREATE TABLE IF NOT EXISTS environments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name varchar(80) NOT NULL, slug varchar(80) NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(project_id, slug)
);
CREATE TABLE IF NOT EXISTS secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name varchar(160) NOT NULL, ciphertext bytea NOT NULL, nonce bytea NOT NULL, auth_tag bytea NOT NULL, key_version integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES users(id), updated_by uuid REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(project_id, name)
);
CREATE TABLE IF NOT EXISTS environment_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), environment_id uuid NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
  secret_id uuid NOT NULL REFERENCES secrets(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(environment_id, secret_id)
);
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  environment_id uuid REFERENCES environments(id) ON DELETE CASCADE, name varchar(100) NOT NULL, description text,
  key_hash char(64) NOT NULL UNIQUE, key_prefix varchar(20) NOT NULL, created_by uuid REFERENCES users(id), can_pull_secrets boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true, expires_at timestamptz, last_used_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), revoked_at timestamptz
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY, actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL, actor_api_key_id uuid REFERENCES api_keys(id) ON DELETE SET NULL,
  action varchar(80) NOT NULL, resource_type varchar(50), resource_id text, result varchar(20) NOT NULL DEFAULT 'success', ip inet, user_agent text,
  metadata jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_created_idx ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS environments_project_idx ON environments(project_id);
CREATE INDEX IF NOT EXISTS secrets_project_idx ON secrets(project_id);
CREATE INDEX IF NOT EXISTS api_keys_project_idx ON api_keys(project_id);

