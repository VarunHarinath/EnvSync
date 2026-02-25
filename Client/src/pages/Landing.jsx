import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  MoreHorizontal
} from 'lucide-react';
import Button from '../components/common/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000] text-[#ededed] selection:bg-white selection:text-black overflow-x-hidden font-['Inter',_sans-serif]">
      {/* Subtle Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/5 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/[0.05] bg-black/50 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">EnvSync</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="text-[13px] font-medium text-[#888] hover:text-white transition-colors">Documentation</a>
          <a href="#" className="text-[13px] font-medium text-[#888] hover:text-white transition-colors">Features</a>
          <a href="#" className="text-[13px] font-medium text-[#888] hover:text-white transition-colors">Security</a>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-[13px] text-[#888] hover:text-white hover:bg-transparent px-2"
            onClick={() => navigate('/projects')}
          >
            Log in
          </Button>
          <Button 
            className="bg-white text-black hover:bg-[#e1e1e1] px-5 py-2 h-9 text-[13px] font-semibold border-none rounded-full"
            onClick={() => navigate('/projects')}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-bold text-purple-400 mb-10 animate-fade-in tracking-wider uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
          </span>
          NOW IN OPEN BETA
        </div>
        
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.95] text-white">
          Ship faster.<br />
          <span className="text-[#888]">Without leaking secrets.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          EnvSync centralizes and encrypts environment variables across development, staging, and production — with millisecond sync and zero plaintext exposure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            className="h-12 px-8 bg-white text-black hover:bg-[#e1e1e1] border-none text-[15px] font-bold rounded-full group"
            onClick={() => navigate('/projects')}
          >
            Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
          <Button variant="outline" className="h-12 px-8 text-[15px] border-white/[0.1] text-white hover:bg-white/[0.03] font-medium rounded-full bg-transparent">
            View Documentation
          </Button>
        </div>

        {/* Improved Dashboard Mockup (MacOS Window) */}
        <div className="mt-24 relative group mx-auto">
          <div className="absolute -inset-1 bg-purple-500/20 rounded-2xl blur-3xl opacity-20 transition-opacity" />
          <div className="relative bg-[#080808] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-black/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="mx-auto flex items-center gap-2 text-[10px] text-[#444] font-mono">
                <Globe className="w-3 h-3" />
                console.envsync.com/projects/payment-gateway/secrets
              </div>
            </div>
            
            <div className="flex">
              {/* Sidebar Mock */}
              <div className="hidden md:flex w-48 border-r border-white/[0.05] flex-col p-4 gap-4">
                <div className="h-2 w-24 bg-white/5 rounded" />
                <div className="space-y-2 mt-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-2 rounded ${i === 2 ? 'w-28 bg-purple-500/20' : 'w-24 bg-white/[0.02]'}`} />
                  ))}
                </div>
              </div>
              
              {/* Content Mock */}
              <div className="flex-1 p-6 md:p-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Production Secrets</h4>
                    <p className="text-[11px] text-[#444]">manage keys for your staging environment</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-white/5 rounded border border-white/[0.05] flex items-center justify-center">
                      <Search className="w-3.5 h-3.5 text-[#444]" />
                    </div>
                    <div className="px-3 h-7 bg-white text-black text-[10px] font-bold rounded flex items-center gap-1.5">
                      <Plus className="w-3 h-3" /> New Secret
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'DATABASE_URL', val: 'postgres://admin:••••••••@aws-0-us-east-1...' },
                    { key: 'STRIPE_SECRET_KEY', val: 'sk_live_••••••••••••••••••••••••' },
                    { key: 'AWS_ACCESS_KEY_ID', val: 'AKIA••••••••••••••••' }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.05] bg-white/[0.01]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-mono text-white tracking-tight">{s.key}</span>
                        <span className="text-[10px] font-mono text-[#444] truncate max-w-[200px]">{s.val}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500/50" />
                        <MoreHorizontal className="w-3.5 h-3.5 text-[#222]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-40 px-8 max-w-7xl mx-auto border-t border-white/[0.05]">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">Everything you need to manage secrets.</h2>
          <p className="text-[#888] text-xl font-medium tracking-tight">Simple. Secure. Scalable.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: Zap, 
              title: 'Instant Sync', 
              desc: 'Synchronize environment variables across your stack in milliseconds.' 
            },
            { 
              icon: Shield, 
              title: 'End-to-End Encryption', 
              desc: 'Secrets encrypted at rest and in transit. No plaintext exposure.' 
            },
            { 
              icon: Code, 
              title: 'SDK-Based Integration', 
              desc: 'Integrate via Node.js and Python SDKs with minimal configuration.' 
            }
          ].map((card, i) => (
            <div key={i} className="group p-10 rounded-3xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-8 group-hover:border-white/20 transition-colors">
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{card.title}</h3>
              <p className="text-[15px] text-[#888] leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section with Connectors */}
      <section className="py-40 px-8 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">How EnvSync Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Horizontal Line Connector (Desktop) */}
            <div className="hidden md:block absolute top-[20px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent z-0" />
            
            {[
              { 
                icon: Shield, 
                title: 'Store Secrets Securely', 
                desc: 'Secrets encrypted using AES-256-GCM and never stored in plaintext.' 
              },
              { 
                icon: Layers, 
                title: 'Attach to Environments', 
                desc: 'Assign secrets to development, staging, or production environments.' 
              },
              { 
                icon: Key, 
                title: 'Generate Scoped API Keys', 
                desc: 'Create environment-specific API keys with granular access control.' 
              },
              { 
                icon: Terminal, 
                title: 'Pull via SDK', 
                desc: 'Applications retrieve only the secrets they are authorized to access.' 
              }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-[#000] border border-white/[0.1] flex items-center justify-center mb-8 shadow-2xl">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-4 tracking-tight">{step.title}</h4>
                <p className="text-[14px] text-[#888] leading-relaxed">
                  {step.desc}
                </p>
                <div className="mt-8 flex items-center gap-2">
                   <div className="text-[11px] font-mono text-[#333]">0{i + 1}</div>
                   {i < 3 && <div className="md:hidden flex-1 h-[1px] bg-white/[0.05]" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Section with VS Code Mockup */}
      <section className="py-40 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-10 leading-[1.1]">
              Built for Engineers.<br />
              Designed for Scale.
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                'PostgreSQL-backed architecture',
                'End-to-end encryption',
                'Environment-scoped API keys',
                'RESTful API',
                'Load tested infrastructure',
                'Designed for horizontal scaling'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-white opacity-40" />
                  <span className="text-[15px] font-medium text-[#888]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-white/[0.05] rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* VS Code Mockup */}
            <div className="relative bg-[#0d1117] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl flex flex-col">
              {/* SDK Name Header (MNC Style) */}
              <div className="bg-[#111] border-b border-white/[0.05] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Code className="w-3.5 h-3.5 text-blue-400" />
                   <span className="text-[10px] font-bold text-[#666] tracking-widest uppercase">envsync-node-sdk v4.12.0</span>
                </div>
                <div className="flex gap-1">
                   {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-[#333]" />)}
                </div>
              </div>

              {/* Title Bar / Tabs */}
              <div className="bg-[#161b22] px-3 py-2 flex items-center border-b border-white/[0.03]">
                <div className="flex gap-1.5 mr-6">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="bg-[#0d1117] px-4 py-1.5 border-t border-blue-500/50 rounded-t-lg flex items-center gap-2">
                   <span className="text-blue-400 text-[10px] font-mono">JS</span>
                   <span className="text-[11px] text-[#888] font-mono">index.js</span>
                   <div className="w-2 h-2 rounded-full border border-white/10" />
                </div>
              </div>

              {/* Code Content */}
              <div className="p-8 font-mono text-[13px] leading-relaxed flex">
                <div className="hidden sm:flex flex-col text-right pr-6 border-r border-white/[0.03] text-[#333] select-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <span key={n}>{n}</span>)}
                </div>
                <div className="pl-6 flex flex-col">
                  <p className="text-[#a5d6ff]"><span className="text-[#ff7b72]">import</span> client <span className="text-[#ff7b72]">from</span> <span className="text-[#a5d6ff]">'@envsync/node'</span></p>
                  <p className="mt-4"><span className="text-[#ff7b72]">await</span> client.<span className="text-[#d2a8ff]">init</span>({'{'}</p>
                  <p className="pl-6 text-[#c9d1d9]">apiKey: process.env.<span className="text-[#79c0ff]">STORAGE_KEY</span>,</p>
                  <p className="pl-6 text-[#c9d1d9]">env: <span className="text-[#a5d6ff]">'production'</span></p>
                  <p className="text-[#c9d1d9]">{'}'})</p>
                  <p className="mt-4 text-[#8b949e]">// Fetch secret with zero overhead</p>
                  <p className="text-[#c9d1d9]"><span className="text-[#ff7b72]">const</span> dbPassword = <span className="text-[#ff7b72]">await</span> client.<span className="text-[#d2a8ff]">get</span>(<span className="text-[#a5d6ff]">'DB_PASS'</span>)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-40 px-8 max-w-5xl mx-auto border-t border-white/[0.05]">
        <div className="p-20 rounded-[40px] border border-white/[0.12] bg-gradient-to-b from-[#080808] to-black text-center relative overflow-hidden group shadow-[0_0_50px_rgba(255,255,255,0.02)]">
          <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Developer Documentation</h2>
          <p className="text-[#888] mb-12 max-w-xl mx-auto font-medium text-lg leading-relaxed">
            Clear API references. SDK guides. Security model. Architecture overview. Everything you need to get started in minutes.
          </p>
          <Button className="h-12 px-12 bg-white text-black hover:bg-[#e1e1e1] border-none font-bold rounded-full">
            View Docs
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-32 pb-16 px-8 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-7 h-7 bg-gradient-to-tr from-purple-600 to-blue-500 rounded flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">EnvSync</span>
            </div>
            <p className="text-sm text-[#444] font-medium tracking-tight">Built for engineers by engineers.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-[11px] font-bold tracking-[0.2em] uppercase text-[#444]">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/[0.05] text-center text-[10px] text-[#222] font-bold tracking-[0.3em] uppercase">
          <p>© 2026 EnvSync Inc. Production Ready Infrastructure.</p>
        </div>
      </footer>
    </div>
  );
}
