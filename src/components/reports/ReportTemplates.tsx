import React, { useState } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  Download,
  Users,
  Eye,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportTemplate } from '../../types';
import { exportToPDF, exportToExcel } from '../../services/exportService';

export function ReportTemplates() {
  const { reportTemplates, activeProject, activeSprint, tasks, riskPredictions, currentUser, setToastMessage } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null);

  const categories = ['All', 'Sprint & Agile', 'Portfolio & Exec', 'Team & Resources', 'AI & Predictive Risk', 'Compliance & Audit'];

  const filteredTemplates = reportTemplates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRunTemplate = (tmpl: ReportTemplate, format: 'pdf' | 'excel' = 'pdf') => {
    const data = {
      title: tmpl.title,
      project: activeProject,
      sprint: activeSprint,
      tasks,
      risks: riskPredictions,
      generatedBy: currentUser.name,
    };

    if (format === 'pdf') exportToPDF(data);
    else exportToExcel(data);

    setToastMessage(`Generated report from template "${tmpl.title}" in ${format.toUpperCase()}`);
    setPreviewTemplate(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search & Category Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search report templates by keyword or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-2xl font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-6 rounded-3xl bg-white border border-zinc-200/80 hover:border-zinc-400 transition-all flex flex-col justify-between space-y-4 shadow-xs group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold uppercase tracking-wider">
                  {tmpl.category}
                </span>
                {tmpl.isSystem && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <ShieldCheck className="w-3 h-3" /> System Standard
                  </span>
                )}
              </div>

              <h3 className="font-display text-base font-bold text-zinc-900 group-hover:text-brand-green transition-colors">
                {tmpl.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{tmpl.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tmpl.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-zinc-50 text-zinc-500 text-[10px] font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <div className="text-[11px] text-zinc-400">
                Popular for: <span className="font-semibold text-zinc-700">{tmpl.popularForRoles.join(', ')}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewTemplate(tmpl)}
                  className="flex-1 py-2 rounded-2xl bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={() => handleRunTemplate(tmpl, 'pdf')}
                  className="flex-1 py-2 rounded-2xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-brand-green" /> Run Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 border border-zinc-200 shadow-2xl relative space-y-6">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-full bg-brand-green/20 text-zinc-900 text-[10px] font-bold uppercase">
                {previewTemplate.category}
              </span>
              <h2 className="font-display text-xl font-bold text-zinc-900">{previewTemplate.title}</h2>
              <p className="text-xs text-zinc-500 leading-relaxed">{previewTemplate.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3 text-xs">
              <h4 className="font-bold text-zinc-900">Included Default Metrics:</h4>
              <div className="grid grid-cols-2 gap-2">
                {previewTemplate.defaultKPIs.map((kpi) => (
                  <div key={kpi} className="flex items-center gap-2 text-zinc-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{kpi}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-200">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2.5 rounded-2xl bg-zinc-100 text-zinc-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleRunTemplate(previewTemplate, 'excel')}
                className="px-4 py-2.5 rounded-2xl bg-zinc-200 text-zinc-800 text-xs font-semibold hover:bg-zinc-300 transition-colors cursor-pointer"
              >
                Export Excel
              </button>
              <button
                onClick={() => handleRunTemplate(previewTemplate, 'pdf')}
                className="px-5 py-2.5 rounded-2xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-brand-green" /> Run PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
