import React, { useState } from "react";
import Logo from "../common/Logo";

const repo = "https://github.com/VarunHarinath/EnvSync";
export function SectionLabel({ number, children, detail }) {
  return (
    <div className="lp-section-label">
      <span>
        {number} / {children}
      </span>
      <span>{detail || "ENVSYNC — SYSTEM NOTES"}</span>
    </div>
  );
}
export function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="lp-nav">
      <a href="#" className="lp-brand" aria-label="EnvSync home">
        <Logo />
        EnvSync
      </a>
      <button
        className="lp-menu"
        aria-expanded={open}
        aria-controls="landing-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "CLOSE −" : "MENU +"}
      </button>
      <nav
        id="landing-navigation"
        className={open ? "is-open" : ""}
        aria-label="Main navigation"
        onClick={() => setOpen(false)}
      >
        <a href="#environments">
          <small>01</small> PRODUCT
        </a>
        <a href="#agents">
          <small>02</small> AGENTS
        </a>
        <a href="#security">
          <small>03</small> SECURITY
        </a>
        <a href={`${repo}#readme`}>
          <small>04</small> DOCS ↗
        </a>
      </nav>
      <a className="lp-nav-cta" href="#start">
        GET STARTED <span>↗</span>
      </a>
    </header>
  );
}
export function Hero() {
  const [identity, setIdentity] = useState("DEVELOPER");
  const grants = {
    DEVELOPER: ["READ + WRITE", "READ + WRITE", "READ", "DENIED"],
    APPLICATION: ["READ", "DENIED", "READ", "READ"],
    AGENT: ["READ + WRITE", "READ", "DENIED", "DENIED"],
  };
  return (
    <section className="lp-hero lp-wrap">
      <SectionLabel number="00" detail="OPEN SOURCE / SELF-HOSTED">
        SECRETS, IN THEIR PLACE
      </SectionLabel>
      <h1>
        <span>ENVIRONMENT</span>
        <span>VARIABLES,</span>
        <span className="lp-hero-indent">WITHOUT THE</span>
        <span className="lp-hero-last">
          <i>.ENV</i> CHAOS<span className="lp-period">.</span>
        </span>
      </h1>
      <div className="lp-hero-bottom">
        <p>
          Store secrets in one place.
          <br />
          Separate them by environment.
          <br />
          Control who — or what — gets access.
        </p>
        <div className="lp-hero-links">
          <a className="lp-action" href="#start">
            GET STARTED <span>↗</span>
          </a>
          <a className="lp-text-link" href={repo}>
            EXPLORE THE SOURCE ↗
          </a>
        </div>
        <span className="lp-scroll-note">
          SCROLL TO TRACE
          <br />
          THE CONNECTION ↓
        </span>
      </div>
      <div className="lp-routing">
        <div className="lp-routing-head">
          <span>FIG. 00 / ACCESS ROUTING</span>
          <span>INTERACTIVE MODEL</span>
        </div>
        <div className="lp-routing-body">
          <div className="lp-secret-stack">
            {["DATABASE_URL", "REDIS_URL", "JWT_SECRET", "API_KEY"].map(
              (name, i) => (
                <div key={name}>
                  <span>0{i + 1}</span>
                  {name}
                  <b>······</b>
                </div>
              ),
            )}
          </div>
          <div className="lp-router">
            <div className="lp-router-line" />
            <Logo />
            <span>ENVSYNC</span>
            <small>AUTHORIZE → RESOLVE</small>
          </div>
          <div className="lp-routes">
            {["DEV", "TEST", "STAGE", "PROD"].map((env, i) => (
              <div
                key={env}
                className={grants[identity][i] === "DENIED" ? "is-denied" : ""}
              >
                <span>{env}</span>
                <b>{grants[identity][i]}</b>
                <span className="lp-route-dot" />
              </div>
            ))}
          </div>
        </div>
        <div className="lp-identity">
          <span>REQUESTING IDENTITY</span>
          {Object.keys(grants).map((name) => (
            <button
              aria-pressed={identity === name}
              className={identity === name ? "active" : ""}
              onClick={() => setIdentity(name)}
              key={name}
            >
              {name}
              {name === "AGENT" ? " / V2 PREVIEW" : ""} ↗
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
export function SecretStory() {
  const [organized, setOrganized] = useState(false);
  return (
    <section className="lp-story lp-wrap">
      <SectionLabel number="01" detail="FROM COPIES TO CONTROL">
        THE .ENV PROBLEM
      </SectionLabel>
      <div className="lp-story-layout">
        <h2>
          Which copy
          <br />
          is the <em>right</em>
          <br />
          copy?
        </h2>
        <div className={`lp-file-field ${organized ? "organized" : ""}`}>
          <span className="lp-micro">
            {organized
              ? "AFTER / ONE SOURCE OF TRUTH"
              : "BEFORE / SIX FILES. FIVE PLACES."}
          </span>
          <div className="lp-files">
            {[
              ".env",
              ".env.local",
              ".env.production",
              ".env.backup",
              ".env-final",
              ".env-final-2",
            ].map((file, i) => (
              <div style={{ "--i": i }} key={file}>
                <span>
                  {["LAPTOP", "SLACK", "SERVER", "CI", "DOCS", "LAPTOP"][i]}
                </span>
                <b>{file}</b>
              </div>
            ))}
          </div>
          <div className="lp-consolidated" aria-hidden={!organized}>
            <Logo />
            <b>EnvSync</b>
            <span>DEV / TEST / STAGE / PROD</span>
          </div>
          <button
            className="lp-text-link"
            onClick={() => setOrganized(!organized)}
          >
            {organized ? "REPLAY THE CHAOS ↺" : "BRING IT TOGETHER →"}
          </button>
        </div>
      </div>
      <p className="lp-story-caption">
        Same project. Fewer copies. <strong>One source of truth.</strong>
      </p>
    </section>
  );
}
export function LocalSection() {
  return (
    <>
      <section className="lp-local lp-wrap">
        <SectionLabel number="07" detail="LOCAL / SELF-HOSTED">
          CLOSE TO YOUR CODE
        </SectionLabel>
        <div className="lp-local-layout">
          <div>
            <h2>
              Your infrastructure.
              <br />
              Your secrets.
            </h2>
            <p>
              Run EnvSync on infrastructure you control.
              <br />
              Laptop. Home server. Private VM.
              <br />
              Company network.
            </p>
            <p className="lp-micro">NO MANDATORY SECRETS SAAS.</p>
          </div>
          <div className="lp-topology">
            <div className="lp-micro">YOUR MACHINE / PRIVATE NETWORK</div>
            <div className="lp-docker">
              <span>DOCKER COMPOSE</span>
              <div className="lp-topology-brand">
                <Logo /> ENVSYNC
              </div>
              <div className="lp-services">
                {[
                  "FRONTEND / NGINX",
                  "API / NODE.JS",
                  "DATABASE / POSTGRESQL",
                ].map((x) => (
                  <div key={x}>
                    <span>↳</span>
                    {x}
                  </div>
                ))}
              </div>
              <small>DATABASE NETWORK / INTERNAL</small>
            </div>
          </div>
        </div>
      </section>
      <section id="start" className="lp-start lp-wrap">
        <SectionLabel number="08" detail="NODE.JS 20+ / DOCKER REQUIRED">
          START HERE
        </SectionLabel>
        <h2>
          Take control.
          <br />
          <span>Keep it local.</span>
        </h2>
        <div className="lp-start-bottom">
          <p>
            Clone the repository.
            <br />
            Run the guided setup.
            <br />
            Your first environment starts here.
          </p>
          <div className="lp-install">
            <pre>
              <code>
                git clone https://github.com/VarunHarinath/EnvSync.git{"\n"}cd
                EnvSync{"\n"}npm run setup
              </code>
            </pre>
            <a href={`${repo}#one-command-setup-after-cloning`}>
              SETUP DOCUMENTATION ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
export function LandingFooter() {
  return (
    <footer className="lp-footer lp-wrap">
      <a href="#" className="lp-brand">
        <Logo />
        EnvSync
      </a>
      <span>OPEN SOURCE / APACHE-2.0</span>
      <div>
        <a href={repo}>GITHUB ↗</a>
        <a href={`${repo}#readme`}>DOCS ↗</a>
        <a href="/login">SIGN IN ↗</a>
      </div>
      <p>Secrets have a place.</p>
    </footer>
  );
}
