import React from 'react';
import { motion } from 'motion/react';
import { Server, Database, Cpu, Lock, CheckCircle2, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ArchitectureSection() {
  const { setActiveTab } = useApp();

  return (
    <section id="risk-prediction" className="py-24 px-4 md:px-8 bg-zinc-900 text-white relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5">
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-brand-green text-black">
              System Architecture
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mt-4 leading-tight">
              Decoupled ML Pipeline & Explainable AI
            </h2>
            <p className="text-zinc-400 text-base md:text-lg mt-4 leading-relaxed">
              AgilePulse AI employs a decoupled enterprise architecture. The React frontend interacts with Node.js Express APIs, which orchestrate FastAPI Python Machine Learning inference services.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3 text-sm text-zinc-300">
                <div className="p-1 rounded bg-brand-green text-black mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>
                  <strong className="text-white">SHAP Feature Explainability:</strong> Every risk score includes transparent factor weightings explaining <em>why</em> a risk was raised.
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300">
                <div className="p-1 rounded bg-brand-green text-black mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>
                  <strong className="text-white">Stateless AI Inference:</strong> Machine learning models run in isolated Python FastAPI microservices with sub-300ms inference timing.
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300">
                <div className="p-1 rounded bg-brand-green text-black mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>
                  <strong className="text-white">Zero Third-Party Key Leakage:</strong> All AI processing occurs behind secure server-side API proxies.
                </span>
              </li>
            </ul>

            <div className="mt-10">
              <button
                onClick={() => setActiveTab('simulator')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green text-black font-semibold hover:bg-lime-400 transition-colors shadow-lg cursor-pointer"
              >
                Launch AI Simulator <Cpu className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Architecture Diagram Card */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 rounded-3xl bg-zinc-800/80 border border-zinc-700 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-zinc-400 ml-2">agilepulse-system-flow.sys</span>
                </div>
                <span className="text-xs font-mono text-brand-green font-semibold">STATUS: ONLINE</span>
              </div>

              {/* Workflow Step Cards */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">React 19 Frontend App</h4>
                      <p className="text-xs text-zinc-400">Renders interactive velocity graphs & Kanban board</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">REST Client</span>
                </div>

                {/* Arrow */}
                <div className="text-center text-zinc-600 text-xs font-mono font-bold uppercase tracking-widest">
                  ↓ Encrypted Payload (JSON)
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Express.js API Orchestrator</h4>
                      <p className="text-xs text-zinc-400">Authenticates JWTs, validates schema, queries MongoDB</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">Node.js Server</span>
                </div>

                {/* Arrow */}
                <div className="text-center text-zinc-600 text-xs font-mono font-bold uppercase tracking-widest">
                  ↓ Feature Engineering Vectors
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-brand-green/40 flex items-center justify-between shadow-lg shadow-brand-green/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        FastAPI ML Microservice
                        <span className="px-2 py-0.5 rounded bg-brand-green text-black text-[10px] font-bold">
                          RandomForest + SHAP
                        </span>
                      </h4>
                      <p className="text-xs text-zinc-400">Generates risk probability, confidence score & recommendations</p>
                    </div>
                  </div>
                  <Cpu className="w-5 h-5 text-brand-green" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
