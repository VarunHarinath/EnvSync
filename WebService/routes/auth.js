import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { query, transaction } from "../db/pool.js";
import { asyncRoute, errors, ok } from "../lib/errors.js";
import { hashPassword, randomToken, sha256, signAccessToken, verifyPassword } from "../lib/security.js";
import { authenticate, requireUser } from "../middleware/auth.js";
import { audit } from "../Services/audit.js";

export const authRouter = Router();
const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });
const cookie = (token, maxAge) => `envsync_refresh=${token}; Path=/api/v1/auth; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${config.env === "production" ? "; Secure" : ""}`;
const parseCookie = (req) => Object.fromEntries((req.headers.cookie || "").split(";").map((v) => v.trim().split("=")).filter((x) => x.length === 2));
const issueSession = async (user, req) => {
  const raw = randomToken(48); const expires = new Date(Date.now() + config.refreshTtlDays * 86400000);
  await query("INSERT INTO refresh_tokens(user_id,token_hash,expires_at,ip,user_agent) VALUES($1,$2,$3,$4,$5)", [user.id, sha256(raw), expires, req.ip, req.get("user-agent")]);
  return { accessToken: signAccessToken(user), refreshToken: raw, expiresIn: config.accessTtlSeconds };
};
authRouter.post("/login", asyncRoute(async (req, res) => {
  const input = loginSchema.safeParse(req.body); if (!input.success) throw errors.badRequest("Valid email and password are required");
  const { rows } = await query("SELECT * FROM users WHERE lower(email)=lower($1)", [input.data.email]); const user = rows[0];
  if (!user || !user.active || (user.locked_until && new Date(user.locked_until) > new Date()) || !(await verifyPassword(input.data.password, user.password_hash))) {
    if (user) await query("UPDATE users SET failed_login_count=failed_login_count+1, locked_until=CASE WHEN failed_login_count>=4 THEN now()+interval '15 minutes' ELSE locked_until END WHERE id=$1", [user.id]);
    await audit(req, "auth.login", "user", user?.id, "failure"); throw errors.unauthorized("Invalid email or password");
  }
  await query("UPDATE users SET failed_login_count=0,locked_until=NULL,last_login_at=now() WHERE id=$1", [user.id]);
  const session = await issueSession(user, req); res.setHeader("Set-Cookie", cookie(session.refreshToken, config.refreshTtlDays * 86400));
  req.user = user; await audit(req, "auth.login", "user", user.id); ok(res, { accessToken: session.accessToken, expiresIn: session.expiresIn, user: { id:user.id, full_name:user.full_name, email:user.email, role:user.role, permissions:user.permissions } });
}));
authRouter.post("/refresh", asyncRoute(async (req, res) => {
  const raw = parseCookie(req).envsync_refresh || req.body?.refreshToken; if (!raw) throw errors.unauthorized();
  const { rows } = await query(`SELECT rt.*,u.full_name,u.email,u.role,u.permissions,u.active FROM refresh_tokens rt JOIN users u ON u.id=rt.user_id WHERE rt.token_hash=$1 AND rt.revoked_at IS NULL AND rt.expires_at>now()`, [sha256(raw)]);
  const current = rows[0]; if (!current?.active) throw errors.unauthorized("Invalid refresh token");
  const session = await transaction(async (db) => { const fresh = randomToken(48); const inserted = await db.query("INSERT INTO refresh_tokens(user_id,token_hash,expires_at,ip,user_agent) VALUES($1,$2,now()+($3||' days')::interval,$4,$5) RETURNING id", [current.user_id,sha256(fresh),config.refreshTtlDays,req.ip,req.get("user-agent")]); await db.query("UPDATE refresh_tokens SET revoked_at=now(),replaced_by=$1 WHERE id=$2", [inserted.rows[0].id,current.id]); return { fresh }; });
  const user = { id:current.user_id, full_name:current.full_name,email:current.email,role:current.role,permissions:current.permissions }; res.setHeader("Set-Cookie", cookie(session.fresh, config.refreshTtlDays*86400)); ok(res,{ accessToken: signAccessToken(user), expiresIn: config.accessTtlSeconds, user });
}));
authRouter.post("/logout", asyncRoute(async (req,res) => { const raw=parseCookie(req).envsync_refresh; if(raw) await query("UPDATE refresh_tokens SET revoked_at=now() WHERE token_hash=$1",[sha256(raw)]); res.setHeader("Set-Cookie",cookie("",0)); ok(res,{ loggedOut:true }); }));
authRouter.get("/me", authenticate, requireUser, (req,res) => ok(res,req.user));
authRouter.post("/change-password", authenticate, requireUser, asyncRoute(async(req,res)=>{ const schema=z.object({currentPassword:z.string(),newPassword:z.string().min(12).max(128)}).safeParse(req.body); if(!schema.success) throw errors.badRequest("New password must be at least 12 characters"); const {rows}=await query("SELECT password_hash FROM users WHERE id=$1",[req.user.id]); if(!(await verifyPassword(schema.data.currentPassword,rows[0].password_hash))) throw errors.unauthorized("Current password is incorrect"); await query("UPDATE users SET password_hash=$1,password_changed_at=now() WHERE id=$2",[await hashPassword(schema.data.newPassword),req.user.id]); await query("UPDATE refresh_tokens SET revoked_at=now() WHERE user_id=$1",[req.user.id]); await audit(req,"user.password_changed","user",req.user.id); ok(res,{changed:true}); }));
