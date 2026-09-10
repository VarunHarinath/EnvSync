import { query } from "../db/pool.js";
export async function audit(req, action, resourceType, resourceId, result = "success", metadata = {}) {
  const safe = Object.fromEntries(Object.entries(metadata).filter(([key]) => !/secret|password|token|value|key/i.test(key)));
  await query(`INSERT INTO audit_logs(actor_user_id,actor_api_key_id,action,resource_type,resource_id,result,ip,user_agent,metadata) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [req.user?.id || null, req.apiKey?.id || null, action, resourceType, resourceId ? String(resourceId) : null, result, req.ip, req.get("user-agent") || null, safe]);
}

