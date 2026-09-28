import React from 'react';
import { BookOpen, Code2, Server, Cpu, ShieldCheck } from 'lucide-react';

export function DocsView() {
  return (
    <div className="w-full space-y-8">
      {/* Title Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-green text-black uppercase">
            Technical Specification
          </span>
          <span className="text-xs font-mono text-zinc-400">System Architecture</span>
        </div>
        <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
          AgilePulse AI Developer Documentation
        </h1>
        <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
          Comprehensive guide to system architecture, machine learning models, REST endpoints, and security standards.
        </p>
      </div>

      <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-8 text-sm text-zinc-800 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-2">
            <Server className="w-5 h-5 text-zinc-900" /> 1. System Overview & Architecture
          </h2>
          <p>
            AgilePulse AI is built as a enterprise cloud platform. The architecture separates UI concerns from predictive machine learning workloads.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-600 text-xs">
            <li><strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS, Motion, Recharts.</li>
            <li><strong>Backend API Proxy:</strong> Express.js server on Node.js.</li>
            <li><strong>AI Inference Service:</strong> FastAPI microservice hosting scikit-learn RandomForest models.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-2">
            <Cpu className="w-5 h-5 text-zinc-900" /> 2. Machine Learning Model & SHAP
          </h2>
          <p>
            Sprint health prediction relies on a trained ensemble classifier analyzing feature vectors:
          </p>
          <div className="p-4 rounded-2xl bg-zinc-900 text-brand-green font-mono text-xs overflow-x-auto">
            Feature Vector: [RemainingPoints, DaysRemaining, VelocityAvg, BlockedTasksCount, CapacityVariance]
            Output: {`{ healthScore: 88, riskLevel: 'low', delayDays: 0, shapImpacts: [...] }`}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-2">
            <ShieldCheck className="w-5 h-5 text-zinc-900" /> 3. Security & API Standards
          </h2>
          <p className="text-xs text-zinc-600">
            All AI operations are proxied server-side. No secret keys or model endpoints are exposed to client browsers.
          </p>
        </section>
      </div>
    </div>
  );
}
