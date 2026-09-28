import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Search, ArrowRight, Activity, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Hero() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const { setActiveTab } = useApp();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setSearchResult("Analyzing current sprint metrics... Velocity is standard, 1 high-risk blocking dependency detected in Auth Service.");
      return;
    }
    setSearchResult(`Predictive analysis for "${query}": Sprint health score is 92%. Low risk of scope creep detected.`);
  };

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center items-center px-4 md:px-8 pt-24 md:pt-28 pb-16 md:pb-20 overflow-hidden bg-bg-base">
      {/* Background Video with Gradient Mask */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 scale-105 filter blur-[1px]"
        >
          <source
            src="https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/videos/hero-bg.mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDEEF5]/60 via-transparent to-[#EDEEF5]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#EDEEF5_85%)]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.12] tracking-tight max-w-4xl mx-auto text-center">
            <span className="text-[#1a1a1a]">AgilePulse AI delivers</span>{' '}
            <br className="hidden sm:inline" />
            <span className="text-[#8e8e8e]">intelligent sprint analytics</span>
            <br />
            <span className="text-[#8e8e8e]">and AI-powered insights to improve</span>
            <br />
            <span className="text-[#8e8e8e]">your</span>{' '}
            {/* Eye Icon UI Element */}
            <span 
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center justify-center align-middle mx-1 sm:mx-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm text-zinc-900 group hover:border-brand-green/80 transition-colors cursor-pointer select-none"
              title="Launch AgilePulse Dashboard"
            >
              <span className="relative flex h-2.5 w-2.5 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-900 flex items-center justify-center">
                  <span className="h-1 w-1 rounded-full bg-brand-green"></span>
                </span>
              </span>
              <Eye className="w-4 h-4 text-zinc-800 transition-transform group-hover:scale-110" />
            </span>{' '}
            <span className="text-[#8e8e8e]">software development workflow.</span>
          </h1>
        </motion.div>

        {/* Search Capsule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-xl mx-auto mt-10 md:mt-12"
        >
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 p-2 pl-5 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg shadow-black/5 transition-all focus-within:bg-white/80 focus-within:border-brand-green/50 focus-within:shadow-xl"
          >
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about sprint health, project risks..."
              className="w-full bg-transparent text-sm md:text-base text-zinc-800 placeholder-zinc-400 focus:outline-none font-sans"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800 transition-colors shrink-0 shadow-md group cursor-pointer"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          {/* Search Result Dropdown / Insight Pill */}
          <AnimatePresence>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="mt-4 p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-md text-left text-xs md:text-sm text-zinc-700 flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-brand-green/30 flex items-center justify-center shrink-0 mt-0.5 text-zinc-900 font-bold">
                  <Activity className="w-4 h-4 text-zinc-900" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-zinc-900 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      Sprint Health Summary
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-green text-zinc-900 font-bold tracking-wide">
                        LIVE AI
                      </span>
                    </span>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="text-xs text-zinc-900 underline font-medium hover:text-black flex items-center gap-1"
                    >
                      Open Dashboard <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="mt-1 text-zinc-600 leading-relaxed">{searchResult}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-14"
        >
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 text-left hover:bg-white/60 transition-all cursor-pointer group hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-brand-green flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-zinc-900 flex items-center justify-between">
              Sprint Health Monitoring
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Real-time velocity tracking and automated capacity forecast across active epics.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('simulator')}
            className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 text-left hover:bg-white/60 transition-all cursor-pointer group hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-brand-green flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-zinc-900 flex items-center justify-between">
              AI Risk Prediction
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Early bottleneck detection and risk score modeling for blocking tasks.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('analytics')}
            className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 text-left hover:bg-white/60 transition-all cursor-pointer group hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-brand-green flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-zinc-900 flex items-center justify-between">
              Predictive Intelligence
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Data-driven agile decision support powered by machine learning algorithms.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Architectural Edge Anchors */}
      {/* Right Glass Pill */}
      <div 
        onClick={() => setActiveTab('dashboard')}
        className="absolute top-1/2 right-6 md:right-12 -translate-y-1/2 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/70 text-xs font-semibold text-zinc-700 tracking-wider shadow-sm select-none hover:bg-white/80 cursor-pointer transition-all"
      >
        <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
        AI — ML
      </div>

      {/* Bottom Left Anchor */}
      <div className="absolute bottom-6 left-6 md:left-12 text-xs font-semibold text-zinc-500 tracking-widest uppercase select-none">
        2026
      </div>

      {/* Bottom Right Anchor */}
      <div className="absolute bottom-6 right-6 md:right-12 text-xs font-semibold text-zinc-500 tracking-wider uppercase select-none">
        AI Sprint Intelligence
      </div>
    </section>
  );
}
