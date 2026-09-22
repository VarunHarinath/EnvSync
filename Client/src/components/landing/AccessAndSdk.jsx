import React, { useState } from "react";
import { SectionLabel } from "./Editorial";
const snippets = {
  "NODE.JS": `import { EnvSync } from "@envsync/node";\n\nconst envsync = new EnvSync({\n  apiKey: process.env.ENVSYNC_API_KEY,\n  baseUrl: "https://envsync.internal"\n});\n\nconst db = await envsync.get("DATABASE_URL");`,
  PYTHON: `import os\nfrom envsync import EnvSync\n\nenvsync = EnvSync(\n    api_key=os.environ["ENVSYNC_API_KEY"],\n    base_url="https://envsync.internal"\n)\n\ndb = envsync.get("DATABASE_URL")`,
};
const rows = [
  ["DEVELOPER", "READ + WRITE", "READ + WRITE", "READ", "DENIED"],
  ["APPLICATION", "READ", "DENIED", "READ", "READ"],
  ["QA", "READ", "READ", "DENIED", "DENIED"],
  ["AGENT / V2", "READ + WRITE", "READ", "DENIED", "DENIED"],
];
export default function AccessAndSdk() {
  const [language, setLanguage] = useState("NODE.JS");
  return (
    <>
      <section className="lp-sdk lp-wrap">
        <SectionLabel number="03" detail="NODE.JS + PYTHON">
          APPLICATION ACCESS
        </SectionLabel>
        <h2>
          Your app asks for
          <br />
          <span>what it needs.</span>
        </h2>
        <div className="lp-sdk-layout">
          <div className="lp-code">
            <div className="lp-code-tabs">
              {Object.keys(snippets).map((x) => (
                <button
                  aria-pressed={language === x}
                  className={language === x ? "active" : ""}
                  onClick={() => setLanguage(x)}
                  key={x}
                >
                  {x}
                </button>
              ))}
              <span>SDK / EXAMPLE</span>
            </div>
            <pre>
              <code>
                {snippets[language].split("\n").map((line, i) => (
                  <span className="lp-code-line" key={i}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {line || " "}
                  </span>
                ))}
              </code>
            </pre>
          </div>
          <div className="lp-request-flow">
            <span className="lp-micro">TRACE / AUTHORIZED REQUEST</span>
            {[
              "APPLICATION",
              "ENVSYNC_API_KEY",
              "DEVELOPMENT",
              "DATABASE_URL",
            ].map((x, i) => (
              <div key={x}>
                <span>0{i + 1}</span>
                {x}
                <small>↓</small>
              </div>
            ))}
            <strong>● AUTHORIZED</strong>
          </div>
        </div>
      </section>
      <section className="lp-access lp-wrap">
        <SectionLabel number="04" detail="ILLUSTRATIVE ASSIGNMENTS">
          ACCESS MODEL
        </SectionLabel>
        <div className="lp-section-heading">
          <h2>Who gets access?</h2>
          <p>
            Access follows assignments.
            <br />
            An identity is never a blank check.
          </p>
        </div>
        <div className="lp-matrix">
          <div className="lp-matrix-header">
            <span>IDENTITY ↓ / ENVIRONMENT →</span>
            {["DEV", "TEST", "STAGE", "PROD"].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          {rows.map(([name, ...grants]) => (
            <div className="lp-matrix-row" key={name}>
              <h3>{name}</h3>
              {grants.map((grant, i) => (
                <div
                  key={i}
                  className={grant === "DENIED" ? "denied" : "allowed"}
                >
                  <small>{["DEV", "TEST", "STAGE", "PROD"][i]}</small>
                  <span>{grant}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="lp-micro lp-matrix-note">
          APPLICATION KEYS: SCOPED RETRIEVAL / AGENT ASSIGNMENTS: V2 PREVIEW
        </p>
      </section>
    </>
  );
}
