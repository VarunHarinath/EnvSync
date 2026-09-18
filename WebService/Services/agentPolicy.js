import { query } from "../db/pool.js";
import { errors } from "../lib/errors.js";

export async function authorizeAgentEnvironment(agentId, environmentId, required = "READ", db = { query }) {
  const { rows } = await db.query(`
    SELECT a.id agent_id,a.status,a.expires_at agent_expires_at,
           x.id assignment_id,x.access_level,x.expires_at assignment_expires_at,
           e.id environment_id,e.project_id,e.name environment_name
    FROM agents a
    JOIN agent_environment_access x ON x.agent_id=a.id
    JOIN environments e ON e.id=x.environment_id
    WHERE a.id=$1 AND e.id=$2 AND x.revoked_at IS NULL AND x.starts_at<=now()
  `,[agentId,environmentId]);
  const grant=rows[0];
  if(!grant || grant.status!=="APPROVED") throw errors.forbidden("Agent is not approved for this environment");
  if(grant.agent_expires_at && new Date(grant.agent_expires_at)<=new Date()) throw errors.forbidden("Agent access has expired");
  if(grant.assignment_expires_at && new Date(grant.assignment_expires_at)<=new Date()) throw errors.forbidden("Environment access has expired");
  if(required==="READ_WRITE" && grant.access_level!=="READ_WRITE") throw errors.forbidden("Read and write access is required");
  return grant;
}

export async function listAuthorizedEnvironments(agentId, db = { query }) {
  const { rows }=await db.query(`SELECT e.id,e.project_id,p.name project_name,e.name,e.slug,x.access_level,x.expires_at
    FROM agent_environment_access x JOIN agents a ON a.id=x.agent_id JOIN environments e ON e.id=x.environment_id JOIN projects p ON p.id=e.project_id
    WHERE x.agent_id=$1 AND a.status='APPROVED' AND x.revoked_at IS NULL AND x.starts_at<=now()
      AND (a.expires_at IS NULL OR a.expires_at>now()) AND (x.expires_at IS NULL OR x.expires_at>now()) ORDER BY e.name`,[agentId]);
  return rows;
}

export function requireMcpPermission(permission) {
  return (req,_res,next)=> {
    if (req.user?.role === "ADMIN") return next();
    if (permission === "mcp_write") return next(errors.forbidden("Administrator access is required to approve or change agents"));
    return req.user?.permissions?.[permission] ? next() : next(errors.forbidden(`Permission ${permission} is required`));
  };
}
