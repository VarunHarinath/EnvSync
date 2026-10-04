import { query } from "../db/pool.js";
import { errors } from "../lib/errors.js";

export function capabilitiesFor(profile, mcpEnabled = true) {
  const business = profile === "business";
  return {projects:true,environments:true,secrets:true,apiKeys:true,sdk:true,audit:true,
    teamManagement:business,resourceSharing:business,organizationRoles:business,
    invitations:false,mcp:mcpEnabled,agents:mcpEnabled};
}
export async function getInstance() {
  const {rows} = await query("SELECT profile,mcp_enabled,owner_user_id,instance_name FROM instance_settings WHERE id=true");
  if (!rows[0]) throw errors.forbidden("Instance setup is required");
  return {...rows[0],capabilities:capabilitiesFor(rows[0].profile,rows[0].mcp_enabled)};
}
export async function enforceInstance(req,_res,next) {
  try {
    req.instance = await getInstance();
    if(req.user && req.instance.profile === "personal" && req.user.id !== req.instance.owner_user_id) throw errors.forbidden("Only the instance owner may access this Personal instance");
    next();
  } catch(error) { next(error); }
}
export const requireCapability = capability => async(req,_res,next) => {
  try { const instance=req.instance || await getInstance(); if(!instance.capabilities[capability]) throw errors.forbidden("This capability is unavailable for this instance"); next(); } catch(error) { next(error); }
};
