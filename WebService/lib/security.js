import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import { errors } from "./errors.js";

const b64url = (value) => Buffer.from(value).toString("base64url");
export const hashPassword = (password) => bcrypt.hash(password, 12);
export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);
export const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString("base64url");

export function signAccessToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({ sub: user.id, role: user.role, permissions: user.permissions, iat: now, exp: now + config.accessTtlSeconds }));
  const signature = crypto.createHmac("sha256", config.jwtSecret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}
export function verifyAccessToken(token) {
  try {
    const [header, payload, signature] = token.split(".");
    const expected = crypto.createHmac("sha256", config.jwtSecret).update(`${header}.${payload}`).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) throw new Error();
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (claims.exp <= Math.floor(Date.now() / 1000)) throw new Error();
    return claims;
  } catch { throw errors.unauthorized("Invalid or expired access token"); }
}
export function encryptSecret(plaintext) {
  const key = Buffer.from(config.encryptionKey, "base64"); const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), "utf8"), cipher.final()]);
  return { ciphertext, nonce: iv, authTag: cipher.getAuthTag(), keyVersion: 1 };
}
export function decryptSecret(row) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(config.encryptionKey, "base64"), row.nonce);
  decipher.setAuthTag(row.auth_tag); return Buffer.concat([decipher.update(row.ciphertext), decipher.final()]).toString("utf8");
}
export function generateApiKey() { const raw = `es_live_${randomToken(32)}`; return { raw, prefix: raw.slice(0, 16), hash: sha256(raw) }; }
export function generateAgentCredential() { const raw = `ea_live_${randomToken(32)}`; return { raw, prefix: raw.slice(0, 16), hash: sha256(raw) }; }
