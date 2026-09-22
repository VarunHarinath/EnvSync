import React, { useEffect, useState } from "react";
import { SectionLabel } from "./Editorial";
export default function AgentScene() {
  const [state, setState] = useState("UNKNOWN"),
    [remaining, setRemaining] = useState(13338),
    [expiresAt, setExpiresAt] = useState(null),
    [permission, setPermission] = useState("READ + WRITE");
  useEffect(() => {
    if (
      state !== "AUTHORIZED" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = setInterval(
      () => setRemaining((n) => Math.max(0, n - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [state]);
  const ttl = [
    Math.floor(remaining / 3600),
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ]
    .map((x) => String(x).padStart(2, "0"))
    .join(" : ");
  const approved = state === "AUTHORIZED";
  return (
    <section id="agents" className="lp-agents lp-wrap">
      <SectionLabel number="05" detail="V2 PREVIEW / INTERACTIVE DEMO">
        AGENT ACCESS
      </SectionLabel>
      <div className="lp-agent-heading">
        <h2>
          Give your agents
          <br />a workspace.
          <br />
          <span>Not your entire vault.</span>
        </h2>
        <p>
          Approve an agent.
          <br />
          Choose its environments.
          <br />
          Set permissions and an expiration.
        </p>
      </div>
      <div className="lp-agent-console">
        <div className="lp-agent-rail">
          <span className="lp-micro">AUTHORIZATION SEQUENCE</span>
          {["UNKNOWN", "PENDING", "AUTHORIZED"].map((x, i) => (
            <div className={state === x ? "current" : ""} key={x}>
              <span>0{i + 1}</span>
              <b>{x}</b>
              <small>
                {
                  [
                    "AGENT_07 / CONNECT",
                    "HUMAN APPROVAL",
                    "ENVIRONMENT ASSIGNED",
                  ][i]
                }
              </small>
            </div>
          ))}
          <p>AI AGENT → MCP → ENVSYNC</p>
          <span className="lp-micro">
            IDENTITY + ENVIRONMENT
            <br />+ PERMISSION + TTL
          </span>
        </div>
        <div className="lp-agent-pass">
          <div className="lp-pass-header">
            <span>BACKEND CODING AGENT</span>
            <b className={approved ? "allowed" : "pending"}>{state}</b>
          </div>
          <div className="lp-agent-fields">
            <div>
              <span>ENVIRONMENT</span>
              <strong>DEVELOPMENT</strong>
            </div>
            <div>
              <span>ACCESS</span>
              <select
                aria-label="Demo agent access"
                value={permission}
                disabled={approved}
                onChange={(e) => setPermission(e.target.value)}
              >
                <option>READ</option>
                <option>READ + WRITE</option>
              </select>
            </div>
          </div>
          <div className="lp-ttl">
            <span>TIME TO LIVE</span>
            <strong>{ttl}</strong>
            <div>
              <span>
                {approved ? "COUNTDOWN ACTIVE" : "STARTS AFTER APPROVAL"}
              </span>
              <span>HRS / MIN / SEC</span>
            </div>
          </div>
          {expiresAt && <p className="lp-expiry">EXPIRES / {new Date(expiresAt).toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'})}</p>}
          <div className="lp-prod-denied">
            <span>PRODUCTION</span>
            <b>
              DENIED <span>↗</span>
            </b>
          </div>
          <div className="lp-agent-controls">
            <p aria-live="polite">
              {approved
                ? "Development authorized. Production remains denied."
                : state === "PENDING"
                  ? "An administrator must approve this request."
                  : "Unknown agents receive zero access."}
            </p>
            <button
              onClick={() => {
                setState(
                  state === "UNKNOWN"
                    ? "PENDING"
                    : state === "PENDING"
                      ? "AUTHORIZED"
                      : "UNKNOWN",
                );
                setRemaining(13338);
                setExpiresAt(state === "PENDING" ? Date.now() + 13338000 : null);
              }}
            >
              {state === "UNKNOWN"
                ? "CONNECT AGENT →"
                : state === "PENDING"
                  ? "APPROVE DEMO ACCESS →"
                  : "RESET DEMO ↺"}
            </button>
          </div>
        </div>
      </div>
      <div className="lp-agent-caption">
        <span>
          Agents connect.
          <br />
          <strong>You decide.</strong>
        </span>
        <p>
          This is a simulated V2 workflow.
          <br />
          No credentials are created or secrets accessed.
        </p>
      </div>
    </section>
  );
}
