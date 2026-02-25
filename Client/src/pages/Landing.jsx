import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Globe, Lock, ArrowRight, Github } from 'lucide-react';
import Button from '../components/common/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background radial gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">EnvSync</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a>
          <Button 
            className="bg-white text-black hover:bg-gray-200 border-none"
            onClick={() => navigate('/projects')}
          >
            Login to Console
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Now in Open Beta
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 leading-tight">
          Sync your secrets. <br />
          <span className="text-purple-500">Anywhere.</span> Instantly.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The most reliable way to manage and sync environment variables across your entire stack. Built for teams that move fast and stay secure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            className="h-12 px-8 bg-purple-600 hover:bg-purple-500 border-none text-md group"
            onClick={() => navigate('/projects')}
          >
            Get Started free <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="ghost" className="h-12 px-8 text-md border-white/10 hover:bg-white/5">
            <Github className="mr-2 w-4 h-4" /> Star on GitHub
          </Button>
        </div>

        {/* Dashboard Preview / Mockup */}
        <div className="mt-24 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#1a1a1a]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="mx-auto text-[10px] text-gray-500 font-mono">console.envsync.dev/projects</div>
            </div>
            <div className="p-4 md:p-8 flex flex-col gap-6 text-left">
              <div className="h-4 w-1/4 bg-white/10 rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="h-3 w-3/4 bg-white/10 rounded mb-4" />
                    <div className="h-2 w-1/2 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need <br /> to manage secrets.</h2>
          <p className="text-gray-400">Simple to use, impossible to break.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Zap, 
              title: 'Instant Sync', 
              desc: 'Sync environment variables across development, staging, and production in milliseconds.' 
            },
            { 
              icon: Shield, 
              title: 'Bank-grade Security', 
              desc: 'End-to-end encryption for all your sensitive data. We never see your values in plain text.' 
            },
            { 
              icon: Globe, 
              title: 'Works Everywhere', 
              desc: 'Integrates with Vercel, Netlify, Railway, and your local terminal with a single command.' 
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6 border-t border-white/5 mt-32">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
              <Lock className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold">EnvSync</span>
          </div>
          <p className="text-xs text-gray-500">© 2026 EnvSync. Built for modern engineers.</p>
        </div>
      </footer>
    </div>
  );
}
