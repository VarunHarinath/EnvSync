import { query } from "../db/pool.js";
export async function audit(req, action, resourceType, resourceId, result = "success", metadata = {}, db = { query }) {
  const allowed=new Set(["required_access","project_id","environment_id","agent_id","access_level","expires_at","assignment_count"]);
  const safe = Object.fromEntries(Object.entries(metadata).filter(([key,value]) => allowed.has(key) && (value===null || ["string","number","boolean"].includes(typeof value))));
  await db.query(`INSERT INTO audit_logs(actor_user_id,actor_api_key_id,actor_agent_id,action,resource_type,resource_id,result,ip,user_agent,metadata) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [req.user?.id || null, req.apiKey?.id || null, req.agent?.id || null, action, resourceType, resourceId ? String(resourceId) : null, result, req.ip, req.get?.("user-agent") || null, safe]);
  if (req.agent?.id) await db.query("UPDATE agents SET last_activity_at=now() WHERE id=$1",[req.agent.id]);
}
