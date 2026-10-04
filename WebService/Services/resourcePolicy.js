import { query } from "../db/pool.js";
import { errors } from "../lib/errors.js";
import { z } from "zod";

// Global permissions are ceilings, not grants to every resource in the instance.
export async function canAccess(user,type,id,write=false,db={query}) {
  if(!z.uuid().safeParse(id).success) return false;
  if(!user || (user.role!=="ADMIN" && !user.permissions?.[write?"write":"read"])) return false;
  const sources={project:"SELECT id project_id,created_by FROM projects WHERE id=$1 AND archived_at IS NULL",
    environment:"SELECT p.id project_id,p.created_by FROM environments e JOIN projects p ON p.id=e.project_id WHERE e.id=$1 AND p.archived_at IS NULL",
    secret:"SELECT p.id project_id,p.created_by FROM secrets s JOIN projects p ON p.id=s.project_id WHERE s.id=$1 AND p.archived_at IS NULL"};
  if(!sources[type]) return false;
  const resource=(await db.query(sources[type],[id])).rows[0];
  if(!resource) return false;
  if(user.role==="ADMIN" || resource.created_by===user.id) return true;
  const shares=(await db.query("SELECT resource_type,resource_id,permission FROM resource_shares WHERE shared_with=$1",[user.id])).rows;
  const granted=(kind,key)=>shares.some(s=>s.resource_type===kind&&s.resource_id===key&&(!write||s.permission==="WRITE"));
  if(granted("project",resource.project_id)||granted(type,id)) return true;
  if(type==="secret") {
    const envs=(await db.query("SELECT environment_id FROM environment_secrets WHERE secret_id=$1",[id])).rows;
    return envs.length>0 && (write?envs.every(e=>granted("environment",e.environment_id)):envs.some(e=>granted("environment",e.environment_id)));
  }
  if(type==="project"&&!write) {
    const descendants=(await db.query("SELECT id,'environment' kind FROM environments WHERE project_id=$1 UNION ALL SELECT id,'secret' kind FROM secrets WHERE project_id=$1",[id])).rows;
    return descendants.some(r=>granted(r.kind,r.id));
  }
  return false;
}
export async function assertAccess(user,type,id,write=false,db={query}) {
  if(!await canAccess(user,type,id,write,db)) throw errors.forbidden("Resource access is not allowed");
}
export async function visibleResources(user,type,rows) {
  const allowed=await Promise.all(rows.map(row=>canAccess(user,type,row.id)));
  return rows.filter((_row,index)=>allowed[index]);
}
export async function authorizeResourceRoute(req,_res,next) {
  try {
    const segments=req.path.split("/").filter(Boolean);
    // Express routing is case-insensitive by default. Policy matching must agree.
    const collection=segments[0]?.toLowerCase(),id=segments[1],child=segments[2]?.toLowerCase(),childId=segments[3];
    if(collection==="sdk") {
      if(!req.apiKey) throw errors.forbidden("An application API key is required");
      if(req.query.projectId && req.query.projectId!==req.apiKey.project_id) throw errors.forbidden();
      if(req.apiKey.environment_id && req.query.environmentId && req.query.environmentId!==req.apiKey.environment_id) throw errors.forbidden();
      return next();
    }
    if(!req.user) return next();
    const write=!["GET","HEAD"].includes(req.method) && child!=="reveal";
    const types={projects:"project",environments:"environment",secrets:"secret"};
    if(types[collection]&&id) {
      await assertAccess(req.user,types[collection],id,write || child==="api-keys");
      if(collection==="environments"&&child==="secrets"&&childId) await assertAccess(req.user,"secret",childId,true);
      if(collection==="environments"&&child==="clone") {
        const row=(await query("SELECT project_id FROM environments WHERE id=$1",[id])).rows[0];
        await assertAccess(req.user,"project",row.project_id,true);
      }
    }
    if(collection==="environment-secrets"&&id) {
      if(!z.uuid().safeParse(id).success) throw errors.badRequest("Invalid resource identifier");
      const row=(await query("SELECT environment_id FROM environment_secrets WHERE id=$1",[id])).rows[0];
      if(!row) throw errors.notFound();
      await assertAccess(req.user,"environment",row.environment_id,true);
    }
    next();
  } catch(error) {next(error);}
}
