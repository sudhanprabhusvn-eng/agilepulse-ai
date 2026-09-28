import React from 'react';
import { useApp } from '../../context/AppContext';

export function Footer() {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 px-4 md:px-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-zinc-900 font-bold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-white tracking-tight">AgilePulse AI</span>
          </div>
          <p className="text-xs text-zinc-400 mt-4 leading-relaxed max-w-sm">
            Intelligent Sprint Health & Risk Prediction System. Harness machine learning analytics to identify project risks, optimize developer capacity, and protect delivery deadlines.
          </p>
          <p className="text-[11px] text-zinc-600 mt-6 font-mono">
            © 2026 AgilePulse AI Inc. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono">Platform</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                Live Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('board')} className="hover:text-white transition-colors cursor-pointer">
                Kanban Sprint Board
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('simulator')} className="hover:text-white transition-colors cursor-pointer">
                What-If AI Simulator
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('analytics')} className="hover:text-white transition-colors cursor-pointer">
                Velocity Analytics
              </button>
            </li>
          </ul>
        </div>

        {/* Intelligence */}
        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono">AI Architecture</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="text-zinc-400">RandomForest Risk Classifier v2.4</li>
            <li className="text-zinc-400">SHAP Feature Explainability Pipeline</li>
            <li className="text-zinc-400">FastAPI Microservice Integration</li>
            <li className="text-zinc-400">REST API Server Proxying</li>
          </ul>
        </div>

        {/* Role Quick Switch */}
        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono">Agile Roles</h4>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            Tailored analytics dashboards designed specifically for:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Scrum Master', 'Project Manager', 'Engineering Mgr', 'Product Owner', 'Developer'].map((role) => (
              <span key={role} className="text-[10px] px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
