import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, BrainCircuit, LineChart, Users, AlertOctagon, ArrowRight, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function FeaturesSection() {
  const { setActiveTab } = useApp();

  const features = [
    {
      icon: Activity,
      title: 'Continuous Sprint Health Monitoring',
      description: 'Calculates normalized 0-100 sprint health index in real-time, factoring in task completion velocity, age, blocker frequency, and story point commitment.',
      highlight: '98% Model Accuracy',
    },
    {
      icon: BrainCircuit,
      title: 'Predictive ML Risk Scoring',
      description: 'Machine learning algorithms analyze historical telemetry to flag scope creep, dependency bottlenecks, and developer burnout before deadlines are missed.',
      highlight: 'Proactive Alerting',
    },
    {
      icon: LineChart,
      title: 'Burndown & Forecast Trajectory',
      description: 'Visualizes ideal vs actual story point velocity alongside AI forecasted completion curves to give Scrum Masters accurate delivery timelines.',
      highlight: 'Interactive Charts',
    },
    {
      icon: Users,
      title: 'Team Workload & Capacity Balancing',
      description: 'Detects over-allocated team members automatically and recommends 1-click task reassignments to prevent context-switching stress.',
      highlight: 'Capacity Intelligence',
    },
    {
      icon: AlertOctagon,
      title: 'Dependency Blocker Escalation',
      description: 'Maps cross-task and cross-team dependencies to identify critical path blockers and suggests automated feature flag decouplings.',
      highlight: 'Critical Path Analysis',
    },
    {
      icon: Zap,
      title: 'What-If Scenario Simulator',
      description: 'Experiment with scope additions, capacity adjustments, or sprint length changes to simulate projected sprint health and delivery confidence.',
      highlight: 'Real-time Simulation',
    },
  ];

  return (
    <section id="features" className="py-24 px-4 md:px-8 bg-bg-base border-t border-zinc-200/60 relative">
      <div id="analytics" className="absolute -top-12 left-0" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-black text-brand-green">
            Enterprise Capabilities
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mt-4">
            Intelligence Built for Modern Agile Engineering Teams
          </h2>
          <p className="text-base md:text-lg text-zinc-600 mt-4 leading-relaxed">
            Replace guesswork with machine learning. AgilePulse AI turns raw sprint telemetry into actionable recommendations that keep engineering projects on schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 md:p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-white/80 shadow-sm hover:shadow-md hover:bg-white/90 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-brand-green flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                    {feat.highlight}
                  </span>
                  <h3 className="font-display text-xl font-bold text-zinc-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="text-xs font-semibold text-zinc-900 group-hover:text-black flex items-center gap-1.5 cursor-pointer"
                  >
                    Explore Module <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
