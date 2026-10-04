import React from "react";
import {
  LandingNav,
  Hero,
  SecretStory,
  LocalSection,
  LandingFooter,
} from "../components/landing/Editorial";
import EnvironmentWorkspace from "../components/landing/EnvironmentWorkspace";
import AccessAndSdk from "../components/landing/AccessAndSdk";
import AgentScene from "../components/landing/AgentScene";
import SecuritySpec from "../components/landing/SecuritySpec";
import "../components/landing/landing.css";

export default function Landing() {
  return (
    <div className="env-landing">
      <a className="lp-skip" href="#main">
        Skip to content
      </a>
      <LandingNav />
      <main id="main">
        <Hero />
        <SecretStory />
        <EnvironmentWorkspace />
        <AccessAndSdk />
        <AgentScene />
        <SecuritySpec />
        <LocalSection />
      </main>
      <LandingFooter />
    </div>
  );
}
