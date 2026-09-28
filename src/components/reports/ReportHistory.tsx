import React from 'react';
import { FileText, Download, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportToPDF } from '../../services/exportService';

export function ReportHistory() {
  const {
    reportHistory,
    activeProject,
    activeSprint,
    tasks,
    riskPredictions,
    currentUser,
    setToastMessage,
  } = useApp();

  const handleDownload = (historyTitle: string, format: string) => {
    exportToPDF({
      title: historyTitle,
      project: activeProject,
      sprint: activeSprint,
      tasks,
      risks: riskPredictions,
      generatedBy: currentUser.name,
    });
    setToastMessage(`Downloading "${historyTitle}" in ${format.toUpperCase()}`);
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-zinc-900">Report Execution Audit History</h2>
          <p className="text-xs text-zinc-500">Immutable execution history log with SOC2 compliance timestamps</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200/60">
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Log Traceability Active</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-200/80 text-zinc-500 font-semibold uppercase text-[10px]">
              <th className="py-3 px-3">Report Title</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Triggered By</th>
              <th className="py-3 px-3">Generated Date</th>
              <th className="py-3 px-3">Format</th>
              <th className="py-3 px-3">Execution Time</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {reportHistory.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3.5 px-3 font-bold text-zinc-900">{item.reportTitle}</td>
                <td className="py-3.5 px-3 text-zinc-600 font-mono text-[11px] uppercase">{item.type}</td>
                <td className="py-3.5 px-3 text-zinc-700 font-medium">{item.generatedBy}</td>
                <td className="py-3.5 px-3 text-zinc-500">{item.generatedAt}</td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-mono text-[10px] uppercase font-bold">
                    {item.format}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-zinc-500">{item.executionDurationMs} ms</td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => handleDownload(item.reportTitle, item.format)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-green" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
