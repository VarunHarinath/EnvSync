-- Refuse existing corruption rather than silently moving sensitive values.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM environment_secrets x JOIN environments e ON e.id=x.environment_id JOIN secrets s ON s.id=x.secret_id WHERE e.project_id<>s.project_id) THEN
    RAISE EXCEPTION 'Cross-project secret attachments require operator review';
  END IF;
END $$;
CREATE FUNCTION check_secret_attachment() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE secret_project uuid; environment_project uuid;
BEGIN
  SELECT project_id INTO secret_project FROM secrets WHERE id=NEW.secret_id FOR UPDATE;
  SELECT project_id INTO environment_project FROM environments WHERE id=NEW.environment_id;
  IF secret_project IS DISTINCT FROM environment_project THEN
    RAISE EXCEPTION 'Secret and environment must belong to the same project' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER secret_attachment_boundary BEFORE INSERT OR UPDATE ON environment_secrets
FOR EACH ROW EXECUTE FUNCTION check_secret_attachment();
