import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, ShieldCheck, Target, Users, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AboutSection() {
  const { setActiveTab } = useApp();

  const values = [
    {
      icon: BrainCircuit,
      title: 'Explainable AI & SHAP Transparency',
      description: 'We believe AI should never be a black box. Every risk prediction comes with clear feature importance metrics explaining why a score was generated.',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise-Grade Security',
      description: 'Zero third-party key leakage, server-side API proxying, SOC2 compliance standards, and encrypted PostgreSQL data storage.',
    },
    {
      icon: Target,
      title: 'Proactive Bottleneck Prevention',
      description: 'Shifting from reactive retro discussions to real-time risk mitigation before sprint deadlines are compromised.',
    },
    {
      icon: Users,
      title: 'Human-Centric Engineering',
      description: 'Designed to protect developers from burnout, balance team workload capacity, and empower Scrum Masters with accurate telemetry.',
    },
  ];

  const stats = [
    { value: '98.4%', label: 'Prediction Accuracy Rate' },
    { value: '10,000+', label: 'Sprints Analyzed' },
    { value: '45%', label: 'Average Bottleneck Reduction' },
    { value: '< 300ms', label: 'FastAPI ML Inference Latency' },
  ];

  return (
    <section id="about" className="py-24 px-4 md:px-8 bg-zinc-900 text-white relative overflow-hidden border-t border-zinc-800">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-green/10 rounded-full filter blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-brand-green text-black">
            About AgilePulse AI
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mt-4 leading-tight">
            Empowering Modern Agile Teams with Predictive Machine Learning
          </h2>
          <p className="text-base md:text-lg text-zinc-400 mt-4 leading-relaxed">
            AgilePulse AI was engineered to eliminate sprint delivery uncertainty. By combining real-time telemetry, Random Forest risk classifiers, and RAG knowledge retrieval, we help software organizations deliver high-quality software on time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-zinc-800/60 border border-zinc-700/80 backdrop-blur-md text-center space-y-1"
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-brand-green">{s.value}</div>
              <div className="text-xs text-zinc-400 font-mono">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-zinc-800/40 border border-zinc-700/60 backdrop-blur-md flex items-start gap-5 hover:border-zinc-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0 border border-brand-green/30">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-white">{v.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action Bar */}
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-zinc-800 via-zinc-800/90 to-zinc-900 border border-zinc-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-display text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-brand-green" /> Ready to Transform Your Sprint Analytics?
            </h3>
            <p className="text-xs text-zinc-400">
              Explore live analytics, test scenario simulations, or review developer documentation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('analytics')}
              className="px-5 py-3 rounded-2xl bg-brand-green text-black font-bold text-xs hover:bg-lime-400 transition-all cursor-pointer shadow-lg"
            >
              Open Sprint Analytics
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className="px-5 py-3 rounded-2xl bg-zinc-700 text-white font-bold text-xs hover:bg-zinc-600 transition-all cursor-pointer"
            >
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
