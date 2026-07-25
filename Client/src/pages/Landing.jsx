import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Github,
  Database,
  Key,
  Layers,
  Terminal,
  Command,
  Activity,
  Code,
  Search,
  Plus,
  MoreHorizontal,
  Server,
  Cpu,
  Check,
  CheckCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import Button from "../components/common/Button";
import Logo from "../components/common/Logo";

export default function Landing() {
  const navigate = useNavigate();

  // State for interactive SDK playground
  const [activeTab, setActiveTab] = useState("node");
  const [copiedTab, setCopiedTab] = useState(false);

  // State for interactive dashboard mockup
  const [revealedSecret, setRevealedSecret] = useState(null);
  const [mockSecrets, setMockSecrets] = useState([
    {
      id: 1,
      key: "DATABASE_URL",
      val: "postgresql://db_user:••••••••@db.internal:5432/production",
      fullVal:
        "postgresql://db_user:example-password@db.internal:5432/production",
      env: "Production",
      active: true,
    },
    {
      id: 2,
      key: "PAYMENT_SECRET_KEY",
      val: "payment_key_••••••••••••",
      fullVal: "example-payment-secret-key",
      env: "Production",
      active: true,
    },
    {
      id: 3,
      key: "CLOUD_ACCESS_KEY_ID",
      val: "cloud_access_••••••••",
      fullVal: "example-cloud-access-key",
      env: "Production",
      active: true,
    },
    {
      id: 4,
      key: "JWT_SIGNING_KEY",
      val: "jwt_secret_••••••••••••",
      fullVal: "example-jwt-signing-key",
      env: "Staging",
      active: true,
    },
  ]);

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedTab(true);
    setTimeout(() => setCopiedTab(false), 2000);
  };

  const handleLaunchConsole = () => {
    window.open("http://localhost:5173/projects", "_blank");
  };

  const sdkSnippets = {
    node: {
      lang: "JavaScript",
      title: "envsync-node-sdk",
      cmd: "npm install @envsync/node",
      code: `import es from '@envsync/node';

// Initialize with zero filesystem footprint
await es.init({
  apiKey: process.env.ENVSYNC_API_KEY,
  environment: 'production'
});

// Secrets injected dynamically in-memory
const dbPassword = await es.getSecret('DATABASE_URL');
`,
    },
    python: {
      lang: "Python",
      title: "envsync-python",
      cmd: "pip install envsync-sdk",
      code: `import envsync as es

# Initialize the secure memory vault
es.init(
    api_key="es_live_6f7d9a3...",
    environment="production"
)

# Access secrets without writing to disk
db_password = es.get_secret("DATABASE_URL")
`,
    },
    cli: {
      lang: "CLI",
      title: "envsync-cli",
      cmd: "npm install -g envsync-cli",
      code: `# Initialize database connection and boot application daemon
envsync init --port 8080 --db postgresql://localhost:5432/envsync

# Start local control plane dashboard
envsync start
`,
    },
  };

  const handleToggleRevealSecret = (id) => {
    if (revealedSecret === id) {
      setRevealedSecret(null);
    } else {
      setRevealedSecret(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] text-[#ededed] selection:bg-white selection:text-black overflow-x-hidden font-['Inter',_sans-serif]">
      {/* Dynamic Background Radial Glows (Reusing Logo Colors) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-25%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C084FC]/10 blur-[140px] animate-pulse duration-10000" />
        <div className="absolute bottom-[20%] right-[-15%] w-[50%] h-[50%] rounded-full bg-[#60A5FA]/5 blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#818CF8]/5 blur-[130px] pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto border-b border-white/[0.04] bg-black/40 backdrop-blur-xl sticky top-0">
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Logo className="w-8 h-8 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xl font-bold tracking-tight text-white bg-clip-text">
            EnvSync
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-[13px] font-medium text-[#888] hover:text-white transition-colors"
          >
            Documentation
          </a>
          <a
            href="#"
            className="text-[13px] font-medium text-[#888] hover:text-white transition-colors"
          >
            Security Model
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#888] hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-[13px] text-[#888] hover:text-white hover:bg-white/[0.03] px-3.5 py-1.5 rounded-full"
            onClick={handleLaunchConsole}
          >
            Sign In
          </Button>
          <Button
            className="relative overflow-hidden bg-white text-black hover:bg-white/95 px-5 py-2 text-[13px] font-bold rounded-full border-none group transition-all"
            onClick={handleLaunchConsole}
          >
            Launch Console
          </Button>
        </div>
      </nav>

      {/* Hero Section (Apple style typography + minimalist punch) */}
      <header className="relative z-10 pt-28 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#818CF8]/10 border border-[#818CF8]/25 text-[11px] font-semibold tracking-wider text-[#C084FC] mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#60A5FA] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#818CF8]"></span>
          </span>
          ENTERPRISE-GRADE SELF-HOSTED CONFIGURATION
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-[80px] font-black tracking-tight leading-[0.9] mb-8 text-white max-w-4xl mx-auto">
          The secrets manager <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] via-[#818CF8] to-[#60A5FA]">
            for modern dev teams.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-[#888] max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
          EnvSync is a high-performance, open-source control plane for your
          environment variables. Deploy air-gapped on your private PostgreSQL
          infrastructure, fetch config values in-memory, and keep production
          secrets off developer hard drives.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            className="h-12 px-8 bg-white text-black hover:bg-white/95 text-[14px] font-bold rounded-full group shadow-[0_0_20px_rgba(129,140,248,0.25)] border-none"
            onClick={handleLaunchConsole}
          >
            Launch Console{" "}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            className="h-12 px-8 text-[14px] border-white/[0.08] text-white hover:bg-white/[0.04] font-medium rounded-full bg-transparent hover:border-white/20"
          >
            Read API Docs
          </Button>
        </div>

        {/* Dynamic MacOS Mockup Window (With Interactive Secret Reveal) */}
        <div className="mt-20 relative group mx-auto max-w-4xl">
          <div className="absolute -inset-1 bg-gradient-to-tr from-[#C084FC] via-[#818CF8] to-[#60A5FA] rounded-2xl blur-3xl opacity-20 group-hover:opacity-25 transition-opacity duration-1000" />

          <div className="relative bg-[#050505]/90 border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-md">
            {/* MacOS title bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.04] bg-[#0c0c0c]/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="mx-auto flex items-center gap-2 text-[10px] text-[#555] font-mono select-none">
                <Globe className="w-3.5 h-3.5 text-[#555]" />
                postgres://secrets.corp.internal/envsync
              </div>
              <div className="flex gap-1 opacity-0 pointer-events-none">
                <div className="w-3 h-3" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Mockup Sidebar */}
              <div className="w-full md:w-52 border-r border-white/[0.04] flex flex-col p-4 gap-4 bg-[#070707] text-left">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.05]">
                  <Database className="w-4 h-4 text-[#818CF8]" />
                  <span className="text-xs font-bold text-white">
                    Payment Gateway
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#444] px-2 uppercase tracking-wider">
                    Resources
                  </span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs text-white bg-white/[0.02] border border-white/[0.04] px-2 py-1.5 rounded-md font-medium">
                      <Lock className="w-3.5 h-3.5 text-[#C084FC]" />
                      <span>Secrets</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#666] hover:text-[#bbb] px-2 py-1.5 rounded-md transition-colors font-medium">
                      <Server className="w-3.5 h-3.5" />
                      <span>Environments</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#666] hover:text-[#bbb] px-2 py-1.5 rounded-md transition-colors font-medium">
                      <Key className="w-3.5 h-3.5" />
                      <span>API Keys</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/[0.03] space-y-2 px-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#444]">Vault Latency</span>
                    <span className="font-mono text-green-400 font-bold">
                      0.8ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#444]">Status</span>
                    <span className="font-mono text-green-400 font-bold">
                      Secure
                    </span>
                  </div>
                </div>
              </div>

              {/* Mockup Dashboard Content */}
              <div className="flex-1 p-6 md:p-8 min-h-[380px] bg-[#020202] text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      Secrets Manager
                      <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] text-green-400 font-bold">
                        CONNECTED
                      </span>
                    </h3>
                    <p className="text-xs text-[#555] mt-0.5">
                      Manage encrypted variables mapping to PostgreSQL vault.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="w-3.5 h-3.5 text-[#444] absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search secrets..."
                        disabled
                        className="bg-white/[0.02] border border-white/[0.06] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#333] w-full"
                      />
                    </div>
                    <div className="px-3.5 py-1.5 bg-white hover:bg-white/95 text-black text-xs font-bold rounded-md flex items-center gap-1.5 select-none cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> New Secret
                    </div>
                  </div>
                </div>

                {/* Interactive Table Mock */}
                <div className="space-y-2.5">
                  {mockSecrets.map((s) => (
                    <div
                      key={s.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                        revealedSecret === s.id
                          ? "border-[#818CF8]/30 bg-white/[0.02]"
                          : "border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500/60" />
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-white">
                            {s.key}
                          </span>
                          <span className="text-[11px] font-mono text-[#555] mt-1 select-all break-all max-w-md">
                            {revealedSecret === s.id ? s.fullVal : s.val}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 mt-3 sm:mt-0 justify-end">
                        <span className="text-[10px] font-bold text-[#818CF8]/80 bg-[#818CF8]/5 px-2 py-0.5 rounded border border-[#818CF8]/10 font-mono">
                          {s.env}
                        </span>
                        <button
                          onClick={() => handleToggleRevealSecret(s.id)}
                          className="px-2.5 py-1 text-[10px] font-semibold text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] rounded border border-white/[0.05] flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          {revealedSecret === s.id ? "Hide" : "Reveal"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* OpenAI-style Interactive SDK Playground */}
      <section className="py-28 px-6 max-w-7xl mx-auto border-t border-white/[0.04] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C084FC]/10 border border-[#C084FC]/25 text-[11px] font-bold text-[#C084FC]">
              <Code className="w-3.5 h-3.5" /> DEVELOPER INTEGRATION
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              In-memory injection. <br />
              Zero config files.
            </h2>

            <p className="text-[#888] leading-relaxed text-sm sm:text-base">
              Say goodbye to `.env` files that accidentally leak to GitHub. The
              EnvSync SDK fetches variables directly in-memory, establishing an
              authenticated connection to your PostgreSQL datastore over TLS.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-white/80">
                  No secret footprint on developer hard drives
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-white/80">
                  Sub-millisecond runtime latency
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-white/80">
                  Automatic system environment fallback
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col w-full">
            {/* Playground Window */}
            <div className="bg-[#080808] border border-white/[0.06] rounded-xl overflow-hidden shadow-2xl flex flex-col text-left">
              {/* Window Tab Controls */}
              <div className="bg-[#0b0b0b] border-b border-white/[0.04] px-4 py-2.5 flex flex-wrap justify-between items-center gap-2">
                <div className="flex gap-2">
                  {Object.keys(sdkSnippets).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setCopiedTab(false);
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        activeTab === tab
                          ? "text-white bg-white/[0.06] border border-white/[0.06]"
                          : "text-[#555] hover:text-[#bbb] hover:bg-white/[0.01]"
                      }`}
                    >
                      {sdkSnippets[tab].lang}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#222]"
                    />
                  ))}
                </div>
              </div>

              {/* Install Command Bar */}
              <div className="bg-[#050505] px-6 py-3 border-b border-white/[0.04] flex items-center justify-between text-xs text-[#888] font-mono">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#818CF8]" />
                  <span>{sdkSnippets[activeTab].cmd}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(sdkSnippets[activeTab].cmd)}
                  className="hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Code Editor Body */}
              <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto bg-[#020202]">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-[#444] uppercase tracking-widest">
                    {sdkSnippets[activeTab].title}
                  </span>
                  <button
                    onClick={() => handleCopyCode(sdkSnippets[activeTab].code)}
                    className="px-2.5 py-1 text-[10px] text-[#818CF8] bg-[#818CF8]/10 hover:bg-[#818CF8]/15 border border-[#818CF8]/20 rounded transition-all font-semibold flex items-center gap-1.5"
                  >
                    {copiedTab ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copiedTab ? "Copied!" : "Copy Code"}
                  </button>
                </div>

                <pre className="text-white/90">
                  {activeTab === "node" && (
                    <code>
                      <span className="text-[#F472B6]">import</span> es{" "}
                      <span className="text-[#F472B6]">from</span>{" "}
                      <span className="text-[#60A5FA]">'@envsync/node'</span>;
                      <br />
                      <br />
                      <span className="text-[#9CA3AF]">
                        // Initialize with zero filesystem footprint
                      </span>
                      <br />
                      <span className="text-[#F472B6]">await</span> es.
                      <span className="text-[#C084FC]">init</span>({`{`}
                      <br />
                      &nbsp;&nbsp;apiKey: process.env.
                      <span className="text-[#818CF8]">ENVSYNC_API_KEY</span>,
                      <br />
                      &nbsp;&nbsp;environment:{" "}
                      <span className="text-[#60A5FA]">'production'</span>
                      <br />
                      {`}`});
                      <br />
                      <br />
                      <span className="text-[#9CA3AF]">
                        // Secrets injected dynamically in-memory
                      </span>
                      <br />
                      <span className="text-[#F472B6]">const</span> dbPassword ={" "}
                      <span className="text-[#F472B6]">await</span> es.
                      <span className="text-[#C084FC]">getSecret</span>(
                      <span className="text-[#60A5FA]">'DATABASE_URL'</span>);
                    </code>
                  )}

                  {activeTab === "python" && (
                    <code>
                      <span className="text-[#F472B6]">import</span> envsync{" "}
                      <span className="text-[#F472B6]">as</span> es
                      <br />
                      <br />
                      <span className="text-[#9CA3AF]">
                        # Initialize the secure memory vault
                      </span>
                      <br />
                      es.<span className="text-[#C084FC]">init</span>(<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;api_key=
                      <span className="text-[#60A5FA]">
                        "es_live_6f7d9a3..."
                      </span>
                      ,<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;environment=
                      <span className="text-[#60A5FA]">"production"</span>
                      <br />
                      )<br />
                      <br />
                      <span className="text-[#9CA3AF]">
                        # Access secrets without writing to disk
                      </span>
                      <br />
                      db_password = es.
                      <span className="text-[#C084FC]">get_secret</span>(
                      <span className="text-[#60A5FA]">"DATABASE_URL"</span>)
                    </code>
                  )}

                  {activeTab === "cli" && (
                    <code>
                      <span className="text-[#9CA3AF]">
                        # Initialize database connection and boot application
                        daemon
                      </span>
                      <br />
                      envsync init --port{" "}
                      <span className="text-[#818CF8]">8080</span> --db{" "}
                      <span className="text-[#60A5FA]">
                        "postgresql://localhost:5432/envsync"
                      </span>
                      <br />
                      <br />
                      <span className="text-[#9CA3AF]">
                        # Start local control plane dashboard
                      </span>
                      <br />
                      envsync start
                    </code>
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nvidia-style Infrastructure Performance Metrics Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/[0.04] relative z-10 text-left">
        <div className="text-center md:text-left mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#60A5FA]/10 border border-[#60A5FA]/25 text-[11px] font-bold text-[#60A5FA] mb-4">
            <Activity className="w-3.5 h-3.5" /> METRICS & INFRASTRUCTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Engineered for high throughput.
          </h2>
          <p className="text-[#888] text-base sm:text-lg">
            A secrets server shouldn't add latency to your deployments. EnvSync
            balances performance benchmarks with cryptographic security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              metric: "< 1.2ms",
              label: "Average Fetch Latency",
              desc: "High-speed in-memory indexing bypasses database read-locks for near-zero runtime execution delay.",
            },
            {
              metric: "AES-256",
              label: "Encryption Standard",
              desc: "Secrets are sealed with client-side authenticated AES-256-GCM prior to database persistence.",
            },
            {
              metric: "100%",
              label: "Self-Hosted Control",
              desc: "Run completely offline. Keep API transactions and keys within your physical server boundaries.",
            },
            {
              metric: "Zero",
              label: "Cloud Dependencies",
              desc: "No external SaaS requests, tracking scripts, or telemetry telemetry pings. Absolute server sovereignty.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative p-8 rounded-2xl border border-white/[0.04] bg-[#050505] hover:bg-white/[0.01] hover:border-white/[0.08] transition-all group overflow-hidden"
            >
              {/* Subtle hover accent line */}
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#818CF8]/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#C084FC] to-[#60A5FA] tracking-tight mb-4">
                {item.metric}
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {item.label}
              </h4>
              <p className="text-xs text-[#666] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Anthropic-style Deep-Dive Security Features */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/[0.04] relative z-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C084FC]/10 border border-[#C084FC]/25 text-[11px] font-bold text-[#C084FC]">
              <Shield className="w-3.5 h-3.5" /> SECURITY SPECIFICATIONS
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Strict access logic. Absolute integrity.
            </h2>

            <p className="text-[#888] text-sm leading-relaxed">
              Designed from the database schema up to prevent leaks, maintain
              structural references, and optimize decryption pathways.
            </p>

            <div className="p-6 rounded-2xl border border-white/[0.04] bg-[#050505] space-y-4">
              <h5 className="text-xs font-bold text-[#818CF8] tracking-widest uppercase">
                PostgreSQL Schema Design
              </h5>
              <div className="space-y-2 text-xs text-[#555] font-mono">
                <div className="flex justify-between">
                  <span>PROJECTS</span>
                  <span>1 ── 0..* ENVIRONMENTS</span>
                </div>
                <div className="flex justify-between">
                  <span>SECRETS</span>
                  <span>1 ── 1 SECRET_VALUES</span>
                </div>
                <div className="flex justify-between">
                  <span>API_KEYS</span>
                  <span>Scoped to Projects</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              {
                icon: Key,
                title: "Granular Scoping",
                desc: "Restrict API token authorizations to individual environments (e.g. production-only read access), reducing the blast radius of credentials.",
              },
              {
                icon: Layers,
                title: "Automatic SDK Fallback",
                desc: "If connection to your PostgreSQL daemon fails, the Client SDK reads from system environment variables, preventing server downtime.",
              },
              {
                icon: Database,
                title: "Relational Integrity",
                desc: "Atomic transactional operations in EnvSync make sure mapping table mutations either succeed completely or roll back.",
              },
              {
                icon: Activity,
                title: "Access Audit Logs",
                desc: "Track exact queries, token readings, and variable configurations. Gain comprehensive visibility into when your keys are read.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-white/[0.04] bg-[#020202] space-y-4 hover:border-white/[0.08] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-[#818CF8]" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {feature.title}
                </h4>
                <p className="text-xs text-[#666] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero-Style Outro Documentation Section */}
      <section className="py-28 px-6 max-w-5xl mx-auto border-t border-white/[0.04] relative z-10">
        <div className="p-10 sm:p-20 rounded-[32px] border border-white/[0.06] bg-gradient-to-b from-[#080808]/80 to-black text-center relative overflow-hidden group shadow-[0_0_80px_rgba(129,140,248,0.05)]">
          <div className="absolute inset-0 bg-[#818CF8]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6">
            Get started in minutes.
          </h2>
          <p className="text-[#888] mb-10 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Ready to host your secrets manager? Check out the guides on local
            setups, SDK connections, and Homelab hosting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              className="h-12 px-8 bg-white text-black hover:bg-white/95 font-bold rounded-full border-none"
              onClick={handleLaunchConsole}
            >
              Launch Console
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 text-white hover:bg-white/[0.03] border-white/[0.08] hover:border-white/20 font-bold rounded-full bg-transparent"
            >
              View Docs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-24 pb-12 px-6 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div
              className="flex items-center gap-2.5 group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Logo className="w-7 h-7" />
              <span className="text-lg font-bold text-white">EnvSync</span>
            </div>
            <p className="text-xs text-[#555] font-medium tracking-tight">
              Built for professional development teams. 100% offline-first.
            </p>
            <div className="flex flex-col items-center md:items-start gap-1 mt-1 text-[11px] text-[#666]">
              <span>
                Support:{" "}
                <a
                  href="mailto:support@envsync.me"
                  className="text-[#888] hover:text-white transition-colors"
                >
                  support@envsync.me
                </a>
              </span>
              <span>
                Developer:{" "}
                <a
                  href="mailto:varunharinath@envsync.me"
                  className="text-[#888] hover:text-white transition-colors"
                >
                  varunharinath@envsync.me
                </a>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#444]">
            <a href="#" className="hover:text-white transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Twitter / X
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#333] font-bold tracking-[0.2em] uppercase">
          <p>© 2026 EnvSync Inc. Production Ready Infrastructure.</p>
          <p>Self-Hosted, Air-Gapped, Secure.</p>
        </div>
      </footer>
    </div>
  );
}
