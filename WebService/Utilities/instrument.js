// sentry.js (ESM)
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://e13c0aea0984e6274e893c3cbb301f3d@o4510688026230784.ingest.us.sentry.io/4510760842690560",

  // Send structured logs to Sentry
  enableLogs: true,

  // Tracing
  tracesSampleRate: 1.0, // capture 100% of transactions

  // Send default PII (IP address etc.)
  sendDefaultPii: true,
});
