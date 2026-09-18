import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Clock3,
  Code2,
  Database,
  Eye,
  FileWarning,
  Github,
  KeyRound,
  Layers3,
  LockKeyhole,
  Menu,
  Network,
  Server,
  ShieldCheck,
  Terminal,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import Logo from "../components/common/Logo";

const githubUrl = "https://github.com/VarunHarinath/EnvSync";

function SectionTitle({ eyebrow, title, children, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {children && (
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
          {children}
        </p>
      )}
    </div>
  );
}

function ProductPreview() {
  const [environment, setEnvironment] = useState("Development");
  const values = {
    Development: ["DATABASE_URL", "REDIS_URL", "STRIPE_TEST_KEY"],
    Testing: ["DATABASE_URL", "REDIS_URL", "TEST_USER_TOKEN"],
    Staging: ["DATABASE_URL", "REDIS_URL", "SENTRY_DSN"],
    Production: ["DATABASE_URL", "REDIS_URL", "PAYMENT_PROVIDER_KEY"],
  };
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/10">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Logo className="h-5 w-5" /> EnvSync
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Self-hosted
        </div>
      </div>
      <div className="grid min-h-[360px] sm:grid-cols-[180px_1fr]">
        <aside className="hidden border-r bg-muted/25 p-4 sm:block">
          <p className="px-2 text-xs font-medium text-muted-foreground">
            ACME ENGINEERING
          </p>
          <div className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
            Projects
          </div>
          <div className="mt-1 px-3 py-2 text-sm text-muted-foreground">
            Team access
          </div>
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Audit logs
          </div>
        </aside>
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Projects / Payments API
              </p>
              <h3 className="mt-1 text-xl font-semibold">Environments</h3>
            </div>
            <button className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
              + Add secret
            </button>
          </div>
          <div className="mt-6 flex gap-1 overflow-x-auto border-b">
            {Object.keys(values).map((name) => (
              <button
                key={name}
                onClick={() => setEnvironment(name)}
                className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm ${environment === name ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground"}`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="mt-2 divide-y rounded-lg border">
            {values[environment].map((key, index) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 px-4 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm font-medium">
                    {key}
                  </p>
                  <p className="mt-1 font-mono text-xs tracking-widest text-muted-foreground">
                    ••••••••••••••••
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="hidden text-xs sm:inline">
                    Updated {index + 1}d ago
                  </span>
                  <Eye className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeSample() {
  const [language, setLanguage] = useState("Node.js");
  const samples = {
    "Node.js": `import { EnvSync } from "@envsync/node";\n\nconst envsync = new EnvSync({\n  apiKey: process.env.ENVSYNC_API_KEY,\n  baseUrl: "https://envsync.internal"\n});\n\nconst dbUrl = await envsync.get("DATABASE_URL");`,
    Python: `from envsync import EnvSync\n\nenvsync = EnvSync(\n    api_key=os.environ["ENVSYNC_API_KEY"],\n    base_url="https://envsync.internal"\n)\n\ndb_url = envsync.get("DATABASE_URL")`,
  };
  return (
    <div className="overflow-hidden rounded-xl border bg-[#0b0d10] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4">
        <div className="flex">
          {Object.keys(samples).map((item) => (
            <button
              key={item}
              onClick={() => setLanguage(item)}
              className={`border-b-2 px-3 py-3 text-sm ${language === item ? "border-violet-500 text-white" : "border-transparent text-zinc-500"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <Code2 className="h-4 w-4 text-zinc-600" />
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-zinc-300">
        <code>{samples[language]}</code>
      </pre>
    </div>
  );
}

function EnvironmentShowcase() {
  const [active, setActive] = useState("Development");
  const environments = {
    Development: ["DATABASE_URL", "REDIS_URL", "STRIPE_TEST_KEY"],
    Testing: ["DATABASE_URL", "REDIS_URL", "STRIPE_TEST_KEY"],
    Staging: ["DATABASE_URL", "REDIS_URL", "STRIPE_KEY"],
    Production: ["DATABASE_URL", "REDIS_URL", "STRIPE_KEY"],
  };
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex overflow-x-auto border-b">
        {Object.keys(environments).map((name) => (
          <button
            key={name}
            onClick={() => setActive(name)}
            className={`whitespace-nowrap border-b-2 px-5 py-4 text-sm ${active === name ? "border-primary font-medium" : "border-transparent text-muted-foreground"}`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="grid gap-8 p-6 sm:grid-cols-[1fr_220px] sm:p-8">
        <div className="divide-y rounded-lg border">
          {environments[active].map((name) => (
            <div
              key={name}
              className="flex items-center justify-between px-4 py-3.5"
            >
              <span className="font-mono text-sm">{name}</span>
              <span className="font-mono text-xs tracking-widest text-muted-foreground">
                ••••••••••
              </span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Duplicate environment
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ["Copy secret names", true],
              ["Copy secret values", true],
              ["Copy user access", false],
              ["Copy agent access", false],
              ["Copy API keys", false],
            ].map(([label, on]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span
                  className={on ? "text-emerald-500" : "text-muted-foreground"}
                >
                  {on ? <Check className="h-4 w-4" /> : "Off"}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            Credentials and future agent access are never copied silently.
          </p>
        </div>
      </div>
    </div>
  );
}

function AgentPreview() {
  const [decision, setDecision] = useState("request");
  const [duration, setDuration] = useState("4 hours");
  const [level, setLevel] = useState("Read + write");
  if (decision === "approved")
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Backend Coding Agent</p>
            <p className="text-sm text-emerald-500">
              Approved for {duration.toLowerCase()}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">
              Payments / Development
            </p>
            <p className="mt-2 text-sm font-medium">{level}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">
              Payments / Production
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No access
            </p>
          </div>
        </div>
        <button
          onClick={() => setDecision("request")}
          className="mt-6 text-sm font-medium text-primary"
        >
          Reset preview
        </button>
      </div>
    );
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xl shadow-black/5">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          <span className="text-sm font-semibold">New agent request</span>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          Approval required
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold">MCP-compatible coding agent</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Developer MacBook · payments-api
            </p>
          </div>
        </div>
        <div className="mt-6">
          <label className="text-xs font-medium text-muted-foreground">
            Development access
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["No access", "Read", "Read + write"].map((item) => (
              <button
                key={item}
                onClick={() => setLevel(item)}
                className={`rounded-md border px-2 py-2 text-xs font-medium ${level === item ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <label className="text-xs font-medium text-muted-foreground">
            Access duration
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {["30 minutes", "1 hour", "4 hours", "Today", "Until revoked"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setDuration(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${duration === item ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setDecision("denied")}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Reject
          </button>
          <button
            onClick={() => setDecision("approved")}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Approve agent
          </button>
        </div>
        {decision === "denied" && (
          <p className="mt-4 flex items-center gap-2 text-sm text-red-500">
            <XCircle className="h-4 w-4" />
            Request denied. No access was granted.
          </p>
        )}
      </div>
    </div>
  );
}

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const steps = [
    [
      Database,
      "01",
      "Store",
      "Add environment variables and secrets to EnvSync.",
    ],
    [
      Layers3,
      "02",
      "Organize",
      "Keep development, testing, staging, and production separate.",
    ],
    [Users, "03", "Control", "Choose who or what can access each environment."],
    [
      Code2,
      "04",
      "Use",
      "Applications and approved agents retrieve secrets through the SDK or MCP.",
    ],
  ];
  const security = [
    [
      LockKeyhole,
      "AES-256-GCM encryption",
      "Secrets are encrypted before they’re stored.",
    ],
    [
      Users,
      "Access controls",
      "Choose who can view, change, or retrieve secrets.",
    ],
    [
      KeyRound,
      "Scoped API keys",
      "Restrict application keys to a project or environment.",
    ],
    [
      Clipboard,
      "Audit logs",
      "See when secrets, users, and settings were accessed or changed.",
    ],
    [
      Server,
      "Self-hosted",
      "Keep EnvSync and PostgreSQL inside your infrastructure.",
    ],
    [
      ShieldCheck,
      "Safe sessions",
      "Short-lived access tokens and rotated, hashed refresh tokens.",
    ],
  ];
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/25">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-2.5 font-semibold">
            <Logo className="h-7 w-7" />
            EnvSync
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#product">Product</a>
            <a href="#agents">Agents</a>
            <a href="#security">Security</a>
            <a href={`${githubUrl}#readme`} target="_blank" rel="noreferrer">
              Docs
            </a>
            <a href={githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
          <Link
            to="/login"
            className="hidden rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background md:inline-flex"
          >
            Get started
          </Link>
          <button
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md border p-2 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>
        {mobileOpen && (
          <div className="border-t px-5 py-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm">
              <a href="#product">Product</a>
              <a href="#agents">Agents</a>
              <a href="#security">Security</a>
              <a href={`${githubUrl}#readme`}>Docs</a>
              <a href={githubUrl}>GitHub</a>
              <Link to="/login" className="font-semibold text-primary">
                Get started →
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section
          id="product"
          className="mx-auto max-w-7xl px-5 pb-16 pt-20 text-center sm:px-8 sm:pb-24 sm:pt-28"
        >
          <div className="mx-auto max-w-4xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Server className="h-3.5 w-3.5 text-primary" /> Secrets for
              developers, apps, and AI agents
            </p>
            <h1 className="text-5xl font-semibold tracking-[-0.045em] sm:text-7xl">
              Environment variables,
              <br />
              <span className="text-muted-foreground">
                without the .env chaos.
              </span>
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Store secrets in one secure place, organize them by environment,
              and control what developers, applications, and approved AI agents
              can access.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-5 py-3 font-semibold"
              >
                <Github className="h-4 w-4" /> View on GitHub
              </a>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Self-hosted&nbsp; • &nbsp;Open source&nbsp; • &nbsp;Node.js &amp;
              Python SDKs&nbsp; • &nbsp;MCP agent access
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl text-left">
            <ProductPreview />
          </div>
        </section>

        <section className="border-y bg-muted/25 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
            <SectionTitle
              eyebrow="Why EnvSync"
              title="Stop passing .env files around."
            >
              Secrets end up in Slack, email, old laptops, and files nobody
              remembers creating. EnvSync replaces that mess with one source
              your team can trust.
            </SectionTitle>
            <div className="grid gap-3 font-mono text-sm">
              {[
                ".env.production",
                ".env.production-final",
                ".env.production-new",
                ".env.production-actual",
              ].map((file, i) => (
                <div
                  key={file}
                  className={`flex items-center gap-3 rounded-lg border bg-background px-4 py-3 ${i === 3 ? "border-red-500/30 text-red-500" : "text-muted-foreground"}`}
                >
                  <FileWarning className="h-4 w-4" />
                  {file}
                  {i === 3 && (
                    <span className="ml-auto font-sans text-xs">
                      Is this the latest one?
                    </span>
                  )}
                </div>
              ))}
              <div className="my-1 flex justify-center">
                <ArrowRight className="h-5 w-5 rotate-90 text-primary" />
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-4 font-sans font-semibold">
                <Logo className="h-5 w-5" />
                One secure source in EnvSync
                <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </div>
        </section>

        <section
          id="how"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
        >
          <SectionTitle
            eyebrow="How it works"
            title="Store. Organize. Control. Use."
            center
          >
            A direct path from scattered secrets to predictable access.
          </SectionTitle>
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([Icon, n, title, text]) => (
              <article key={title} className="bg-background p-7">
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {n}
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionTitle
              eyebrow="Environments"
              title="One project. Every environment."
            >
              Keep the same secret structure across development, testing,
              staging, and production without mixing their values.
            </SectionTitle>
            <div className="mt-12">
              <EnvironmentShowcase />
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionTitle
              eyebrow="Team permissions"
              title="Everyone gets the access they need. Nothing more."
            >
              Understand workspace and SDK access at a glance. Only
              administrators can grant permission to retrieve secrets with API
              keys.
            </SectionTitle>
            <div className="mt-12 overflow-x-auto rounded-xl border bg-background">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b bg-muted/30 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Identity</th>
                    <th className="p-4 font-medium">Development</th>
                    <th className="p-4 font-medium">Staging</th>
                    <th className="p-4 font-medium">Production</th>
                    <th className="p-4 font-medium">SDK pull</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ["Bob", "Read + write", "Read + write", "Read", "Allowed"],
                    ["Alice", "Read + write", "Read", "—", "Not allowed"],
                    ["CI server", "—", "—", "—", "Production only"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td
                          key={cell}
                          className={`p-4 ${i === 0 ? "font-medium" : "text-muted-foreground"}`}
                        >
                          {i === 4 && cell !== "Not allowed" ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-600">
                              <Check className="h-3.5 w-3.5" />
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="Node.js + Python SDKs"
              title="Ask for the secret you need."
            >
              Your application sends its API key. EnvSync checks the key and its
              permissions before returning the secret.
            </SectionTitle>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border px-3 py-1.5">
                Scoped keys
              </span>
              <span className="rounded-full border px-3 py-1.5">
                Revocable access
              </span>
              <span className="rounded-full border px-3 py-1.5">
                Typed errors
              </span>
            </div>
          </div>
          <CodeSample />
        </section>

        <section id="agents" className="border-y bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
            <div>
              <span className="mb-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Available in V2
              </span>
              <SectionTitle
                eyebrow="AI agents + MCP"
                title={
                  <>
                    Give your agents a workspace,
                    <br />
                    not your entire vault.
                  </>
                }
              >
                Connect MCP-compatible agents, approve them explicitly, assign
                the environments they can access, and let access expire
                automatically.
              </SectionTitle>
              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <UserCheck className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">
                      Connection is not authorization
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Unknown agents start denied until a person approves
                      access.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Access that expires</p>
                    <p className="mt-1 text-muted-foreground">
                      Choose 30 minutes, one hour, four hours, end of day, or a
                      custom expiry.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">The same environment rules</p>
                    <p className="mt-1 text-muted-foreground">
                      SDK and MCP requests use one
                      authorization engine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <AgentPreview />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionTitle
            eyebrow="Environment access model"
            title="Access follows environments."
          >
            Assign a developer, application, or agent to the environment it
            needs instead of granting hundreds of secrets one at a time.
          </SectionTitle>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              [
                "Development",
                ["Developers", "Backend agent", "Application API key"],
              ],
              ["Testing", ["QA team", "QA agent", "CI"]],
              ["Production", ["Production application", "No AI agents"]],
            ].map(([env, identities], i) => (
              <article
                key={env}
                className={`rounded-xl border bg-card p-5 ${i === 2 ? "border-amber-500/30" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{env}</h3>
                  {i === 2 && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase text-amber-500">
                      Restricted
                    </span>
                  )}
                </div>
                <div className="mt-5 space-y-2">
                  {identities.map((identity) => (
                    <div
                      key={identity}
                      className="flex items-center gap-2 rounded-md bg-muted/35 px-3 py-2.5 text-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {identity}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Agent assignments, time-limited access, user sharing, and scoped
            application API keys are available today.
          </p>
        </section>

        <section className="border-y bg-[#0a0a0b] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <SectionTitle
                eyebrow="MCP activity"
                title="Every request has an answer."
              >
                The audit history shows what an agent
                requested and whether it was allowed—never the secret value.
              </SectionTitle>
              <span className="w-fit rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">
                Live audit trail
              </span>
            </div>
            <div className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
              {[
                [
                  "Backend Coding Agent",
                  "READ DATABASE_URL",
                  "Payments / Development",
                  "Allowed",
                  "2 seconds ago",
                ],
                [
                  "Backend Coding Agent",
                  "READ PAYMENT_PROVIDER_KEY",
                  "Payments / Production",
                  "Denied",
                  "18 seconds ago",
                ],
                [
                  "QA Agent",
                  "LIST SECRETS",
                  "Payments / Testing",
                  "Allowed",
                  "1 minute ago",
                ],
              ].map(([agent, action, env, result, time]) => (
                <div
                  key={action + env}
                  className="grid gap-3 border-b border-white/10 px-5 py-4 last:border-0 sm:grid-cols-[1.3fr_1.2fr_1.4fr_auto_auto] sm:items-center"
                >
                  <span className="text-sm font-medium">{agent}</span>
                  <code className="text-xs text-zinc-400">{action}</code>
                  <span className="text-sm text-zinc-400">{env}</span>
                  <span
                    className={`w-fit rounded-full px-2 py-1 text-xs ${result === "Allowed" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                  >
                    {result}
                  </span>
                  <span className="text-xs text-zinc-600">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="security"
          className="border-y bg-[#0a0a0b] py-20 text-white sm:py-28"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionTitle
              eyebrow="Security · live today"
              title="Simple controls. Serious guardrails."
            >
              Security controls that are useful in day-to-day engineering,
              without getting in your way.
            </SectionTitle>
            <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {security.map(([Icon, title, text]) => (
                <article key={title}>
                  <Icon className="h-5 w-5 text-violet-400" />
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
                </article>
              ))}
            </div>
            <a
              href={`${githubUrl}/blob/main/SECURITY.md`}
              target="_blank"
              rel="noreferrer"
              className="mt-12 inline-flex items-center gap-1 text-sm font-semibold text-violet-400"
            >
              Read the security model <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section
          id="self-hosted"
          className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2"
        >
          <SectionTitle
            eyebrow="Local-first"
            title="Built for where developers actually work."
          >
            Run EnvSync on your laptop, home server, private VM, Docker host, or
            company network. The web app, API, and PostgreSQL database stay on
            infrastructure you control.
          </SectionTitle>
          <div className="rounded-xl border bg-muted/20 p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold">
              <Network className="h-4 w-4 text-primary" /> Your infrastructure
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center text-xs sm:text-sm">
              <div className="rounded-lg border bg-background p-4">
                <Users className="mx-auto mb-2 h-5 w-5" />
                Developers
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="rounded-lg border border-primary/40 bg-primary/5 p-4">
                <Logo className="mx-auto mb-2 h-5 w-5" />
                EnvSync
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="rounded-lg border bg-background p-4">
                <Database className="mx-auto mb-2 h-5 w-5" />
                PostgreSQL
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Web app + REST API + database · managed with Docker Compose
            </p>
          </div>
        </section>

        <section id="setup" className="border-y bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
            <SectionTitle
              eyebrow="Setup"
              title="Clone. Run one command. You’re ready."
            >
              The guided setup starts the Docker stack, prepares PostgreSQL,
              configures encryption, and creates your administrator account.
            </SectionTitle>
            <div className="overflow-hidden rounded-xl border bg-[#0b0d10] text-sm text-zinc-300 shadow-xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2">Terminal</span>
              </div>
              <div className="space-y-4 p-5 font-mono">
                <p>
                  <span className="text-zinc-600">$</span> npm run setup
                </p>
                <p className="font-sans font-semibold text-white">
                  Welcome to EnvSync
                </p>
                <div className="space-y-1 text-zinc-500">
                  <p>
                    Organization <span className="text-white">Acme</span>
                  </p>
                  <p>
                    Admin email{" "}
                    <span className="text-white">admin@acme.com</span>
                  </p>
                </div>
                <div className="space-y-1 text-emerald-400">
                  <p>✓ Database ready</p>
                  <p>✓ Encryption configured</p>
                  <p>✓ Administrator created</p>
                  <p>✓ EnvSync ready at http://localhost</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SectionTitle eyebrow="Open source" title="Open source by design.">
              Run it yourself, inspect the code, and build around your own
              infrastructure. There is no mandatory external identity provider
              or EnvSync cloud account.
            </SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Apache-2.0 licensed",
                "Docker-native setup",
                "Node.js + Python SDKs",
                "PostgreSQL-backed",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-9 flex gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background"
            >
              <Github className="h-4 w-4" />
              View GitHub
            </a>
            <a
              href={`${githubUrl}#readme`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border px-4 py-2.5 text-sm font-semibold"
            >
              Read documentation
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <Terminal className="mx-auto h-7 w-7 text-primary" />
          <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            One place for the secrets your software needs.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Give developers, applications, and approved AI agents only the
            environment access they need.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border px-5 py-3 font-semibold"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:px-8">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Logo className="h-5 w-5" />
            EnvSync
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <a href="#product">Product</a>
            <a href="#agents">Agents</a>
            <a href="#security">Security</a>
            <a href={`${githubUrl}#readme`} target="_blank" rel="noreferrer">
              Docs
            </a>
            <a href={githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={`${githubUrl}/releases`} target="_blank" rel="noreferrer">
              Releases
            </a>
          </div>
          <p>Self-hosted secrets for developers and apps.</p>
        </div>
      </footer>
    </div>
  );
}
