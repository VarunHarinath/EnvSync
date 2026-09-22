import React, { useState } from "react";
import { SectionLabel } from "./Editorial";
const environments = ["Development", "Testing", "Staging", "Production"];
export default function EnvironmentWorkspace() {
  const [active, setActive] = useState(0),
    [duplicated, setDuplicated] = useState(false);
  return (
    <section id="environments" className="lp-environments lp-wrap">
      <SectionLabel number="02" detail="PROJECT / PAYMENTS-API">
        ENVIRONMENTS
      </SectionLabel>
      <div className="lp-section-heading">
        <h2>
          One project.
          <br />
          Every environment.
        </h2>
        <p>
          Keep the names consistent.
          <br />
          Keep the values separate.
        </p>
      </div>
      <div className="lp-workspace">
        <div className="lp-env-tabs" aria-label="Choose an environment">
          {environments.map((env, i) => (
            <button
              key={env}
              aria-pressed={active === i}
              onClick={() => {
                setActive(i);
                setDuplicated(false);
              }}
              className={active === i ? "active" : ""}
            >
              <span>0{i + 1}</span>
              {env}
              <b>↗</b>
            </button>
          ))}
        </div>
        <div className="lp-env-detail">
          <div className="lp-env-title">
            <span className="lp-env-number">0{active + 1}</span>
            <div>
              <span className="lp-micro">ENVIRONMENT / ISOLATED VALUES</span>
              <h3>{environments[active]}</h3>
            </div>
            <span className="lp-micro">03 SECRETS</span>
          </div>
          <div className="lp-secret-table" key={active}>
            {["DATABASE_URL", "REDIS_URL", "API_URL"].map((key, i) => (
              <div key={key}>
                <span>0{i + 1}</span>
                <strong>{key}</strong>
                <span className="lp-mask">••••••••••••</span>
                <small>ENCRYPTED</small>
              </div>
            ))}
          </div>
          <div className="lp-env-foot">
            <span>VALUES ARE MASKED / DEMO</span>
            <button onClick={() => setDuplicated(!duplicated)}>
              {duplicated ? "RESET DEMO ↺" : "DUPLICATE ENVIRONMENT →"}
            </button>
          </div>
          <div aria-live="polite" className="lp-duplicate">
            {duplicated ? (
              <>
                <strong>
                  {environments[active]} → {environments[active]} copy
                </strong>
                <span>
                  Secret attachments copied. API keys and access grants stay
                  separate.
                </span>
              </>
            ) : (
              <span>Same secret names. Different values. Explicit access.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
