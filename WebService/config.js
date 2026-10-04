import "dotenv/config";

const required = (name, fallback) => {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`${name} is required. Run \"npm run setup\" first.`);
  return value;
};

export const config = {
  env: process.env.NODE_ENV || "development",
  host: process.env.HOST || "0.0.0.0",
  port: Number(process.env.PORT || 8080),
  databaseUrl: required("DATABASE_URL", process.env.NODE_ENV === "test" ? "postgres://localhost/envsync_test" : undefined),
  jwtSecret: required("JWT_SECRET", process.env.NODE_ENV === "test" ? "test-jwt-secret-at-least-32-characters" : undefined),
  encryptionKey: required("ENVSYNC_MASTER_KEY", process.env.NODE_ENV === "test" ? "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" : undefined),
  publicUrl: process.env.PUBLIC_URL || "http://localhost:5173",
  corsOrigins: (process.env.CORS_ORIGINS || process.env.PUBLIC_URL || "http://localhost:5173").split(",").map((x) => x.trim()),
  accessTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL || 900),
  refreshTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14),
  trustProxy: process.env.TRUST_PROXY === "true",
};

const master = Buffer.from(config.encryptionKey, "base64");
if (master.length !== 32) throw new Error("ENVSYNC_MASTER_KEY must be a base64-encoded 32-byte key");
if (config.jwtSecret.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters");
if (!Number.isInteger(config.accessTtlSeconds) || config.accessTtlSeconds < 30 || config.accessTtlSeconds > 3600) throw new Error("ACCESS_TOKEN_TTL must be 30–3600 seconds");
if (!Number.isInteger(config.refreshTtlDays) || config.refreshTtlDays < 1 || config.refreshTtlDays > 90) throw new Error("REFRESH_TOKEN_TTL_DAYS must be 1–90 days");
if (!["http:","https:"].includes(new URL(config.publicUrl).protocol)) throw new Error("PUBLIC_URL must use HTTP or HTTPS");
