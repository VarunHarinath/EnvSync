import React from "react";
import { SectionLabel } from "./Editorial";
const specs = [
  ["ENCRYPTION", "AES-256-GCM", "Secrets encrypted before storage."],
  [
    "APPLICATION ACCESS",
    "SCOPED API KEYS",
    "Retrieve only the secrets a key is permitted to pull.",
  ],
  [
    "AGENT ACCESS / V2",
    "EXPLICIT APPROVAL",
    "Pending agents receive no secret access.",
  ],
  [
    "EXPIRATION / V2",
    "TTL + REVOCATION",
    "Agent authorization checks expiry on each request.",
  ],
  [
    "AUDIT",
    "METADATA ONLY",
    "Decrypted secret values stay out of audit history.",
  ],
];
const events = [
  ["21:42:03", "BACKEND_AGENT", "READ DATABASE_URL", "DEV", "ALLOWED"],
  ["21:42:09", "BACKEND_AGENT", "READ STRIPE_SECRET_KEY", "PROD", "DENIED"],
  ["21:42:16", "NODE_API", "READ DATABASE_URL", "PROD", "ALLOWED"],
  ["21:43:01", "ADMIN", "UPDATE REDIS_URL", "STAGE", "ALLOWED"],
];
export default function SecuritySpec() {
  return (
    <section id="security" className="lp-security lp-wrap">
      <SectionLabel number="06" detail="GUARDRAILS / BY DESIGN">
        SECURITY
      </SectionLabel>
      <h2>
        Simple controls.
        <br />
        Serious guardrails.
      </h2>
      <div className="lp-spec">
        {specs.map(([label, title, description], i) => (
          <div key={label}>
            <span>
              0{i + 1} / {label}
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <div className="lp-log">
        <div className="lp-log-header">
          <span>EVENT STREAM / ILLUSTRATIVE V1 + V2 ACTIVITY</span>
          <span>NO SECRET VALUES</span>
        </div>
        {events.map(([time, actor, action, env, result], i) => (
          <div className="lp-log-row" style={{ "--i": i }} key={time}>
            <time>{time}</time>
            <span>{actor}</span>
            <span>{action}</span>
            <span>{env}</span>
            <b className={result === "DENIED" ? "denied" : "allowed"}>
              {result}
            </b>
          </div>
        ))}
      </div>
    </section>
  );
}
