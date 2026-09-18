import { query } from "../db/pool.js";
import { errors } from "../lib/errors.js";
import { sha256, verifyAccessToken } from "../lib/security.js";

export async function authenticate(req, _res, next) {
  try {
    const value = req.headers.authorization || "";
    if (!value.startsWith("Bearer ")) throw errors.unauthorized();
    const token = value.slice(7);
    if (token.startsWith("ea_live_")) {
      const { rows } = await query(`SELECT c.id credential_id,c.active credential_active,c.expires_at credential_expires_at,c.revoked_at credential_revoked_at,a.* FROM agent_credentials c JOIN agents a ON a.id=c.agent_id WHERE c.credential_hash=$1`,[sha256(token)]);
      const agent=rows[0];
      if(!agent||!agent.credential_active||agent.credential_revoked_at||(agent.credential_expires_at&&new Date(agent.credential_expires_at)<=new Date())) throw errors.unauthorized("Invalid, expired, or revoked agent credential");
      req.agent=agent;await query("UPDATE agent_credentials SET last_used_at=now() WHERE id=$1",[agent.credential_id]);await query("UPDATE agents SET last_seen_at=now() WHERE id=$1",[agent.id]);return next();
    }
    if (token.startsWith("es_live_")) {
      const { rows } = await query(`SELECT ak.*, p.archived_at FROM api_keys ak JOIN projects p ON p.id=ak.project_id WHERE key_hash=$1`, [sha256(token)]);
      const key = rows[0];
      if (!key || !key.active || key.revoked_at || key.archived_at || (key.expires_at && new Date(key.expires_at) <= new Date())) throw errors.unauthorized("Invalid, expired, or revoked API key");
      req.apiKey = key; await query("UPDATE api_keys SET last_used_at=now() WHERE id=$1", [key.id]); return next();
    }
    const claims = verifyAccessToken(token);
    const { rows } = await query("SELECT id,full_name,email,role,permissions,active FROM users WHERE id=$1", [claims.sub]);
    if (!rows[0]?.active) throw errors.unauthorized("Account is inactive"); req.user = rows[0]; next();
  } catch (error) { next(error); }
}
export const requireUser = (req, _res, next) => req.user ? next() : next(errors.unauthorized("User authentication required"));
export const requireAdmin = (req, _res, next) => req.user?.role === "ADMIN" ? next() : next(errors.forbidden("Administrator permission required"));
export const requirePermission = (permission) => (req, _res, next) => req.user?.role === "ADMIN" || req.user?.permissions?.[permission] ? next() : next(errors.forbidden());
export const requirePull = (req, _res, next) => req.apiKey?.can_pull_secrets || req.user?.role === "ADMIN" || req.user?.permissions?.can_pull_secrets ? next() : next(errors.forbidden("Secret pull permission is disabled"));
