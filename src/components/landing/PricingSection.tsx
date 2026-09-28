import React from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function PricingSection() {
  const { setActiveTab } = useApp();

  const plans = [
    {
      name: 'Growth Team',
      price: '$49',
      period: '/month',
      description: 'Ideal for small agile teams looking to monitor sprint health and reduce blockers.',
      features: [
        'Up to 3 Active Projects',
        'Real-time Sprint Health Index',
        'Standard Burndown & Velocity Charts',
        'Basic AI Risk Warnings',
        '5 Team Member Licenses',
        'Email & Slack Alerts',
      ],
      isPopular: false,
      buttonText: 'Start Growth Trial',
    },
    {
      name: 'Pro SaaS Enterprise',
      price: '$129',
      period: '/month',
      description: 'For growing engineering organizations needing predictive ML risk modeling & simulator.',
      features: [
        'Unlimited Active Projects & Sprints',
        'Predictive Risk Modeling (RandomForest ML)',
        'What-If Scenario Simulator Tool',
        'AI Recommendation Engine (1-Click Actions)',
        'Up to 25 Team Member Licenses',
        'SHAP Feature Importance Explainability',
        'Executive PDF & CSV Report Generator',
        'Priority Copilot AI Support',
      ],
      isPopular: true,
      buttonText: 'Launch Pro Platform',
    },
    {
      name: 'Custom Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large enterprises requiring on-premise ML deployment, Jira/GitHub sync, and custom SLA.',
      features: [
        'Unlimited Everything',
        'Self-Hosted or Dedicated Cloud ML Service',
        'Custom Risk Model Retraining Strategy',
        'Jira & Azure DevOps Webhook Sync',
        'Role-Based Access Control (RBAC)',
        'Dedicated Solutions Architect',
        'Custom Audit Logs & Compliance Retention',
        '24/7 Enterprise Support SLA',
      ],
      isPopular: false,
      buttonText: 'Contact Enterprise Team',
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-bg-base border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-black text-brand-green">
            Transparent Pricing
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mt-4">
            Predictive Sprint Intelligence for Every Engineering Scale
          </h2>
          <p className="text-base md:text-lg text-zinc-600 mt-4">
            Select the tier that fits your engineering team size. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                plan.isPopular
                  ? 'bg-zinc-900 text-white shadow-2xl relative border-2 border-brand-green'
                  : 'bg-white/80 backdrop-blur-md border border-zinc-200 text-zinc-900 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-green text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}

              <div>
                <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                <p className={`text-xs mt-2 leading-relaxed ${plan.isPopular ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className={`text-xs font-semibold ${plan.isPopular ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-8 space-y-3.5 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <div className={`p-1 rounded-full ${plan.isPopular ? 'bg-brand-green text-black' : 'bg-zinc-100 text-zinc-900'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className={plan.isPopular ? 'text-zinc-300' : 'text-zinc-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 pt-6 border-t border-zinc-200/20">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    plan.isPopular
                      ? 'bg-brand-green text-black hover:bg-lime-400 shadow-lg'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}
                >
                  {plan.buttonText} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
