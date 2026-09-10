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
  databaseUrl: required("DATABASE_URL", "postgres://envsync_admin:envsync_password@localhost:5432/envsync"),
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

