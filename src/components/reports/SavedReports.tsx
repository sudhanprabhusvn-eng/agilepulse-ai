import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Share2,
  Trash2,
  Play,
  Clock,
  Plus,
  CheckCircle2,
  PauseCircle,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SavedReport, ScheduledReport } from '../../types';
import { ShareReportModal } from './ShareReportModal';
import { ScheduleReportModal } from './ScheduleReportModal';
import { exportToPDF } from '../../services/exportService';

export function SavedReports() {
  const {
    savedReports,
    scheduledReports,
    deleteSavedReport,
    toggleScheduleStatus,
    deleteScheduledReport,
    runReportNow,
    activeProject,
    activeSprint,
    tasks,
    riskPredictions,
    currentUser,
    setToastMessage,
  } = useApp();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [activeReportTitle, setActiveReportTitle] = useState('');

  const handleRunReport = (rep: SavedReport) => {
    exportToPDF({
      title: rep.title,
      project: activeProject,
      sprint: activeSprint,
      tasks,
      risks: riskPredictions,
      generatedBy: currentUser.name,
    });
    runReportNow(rep.id, 'pdf');
  };

  const handleOpenShare = (title: string) => {
    setActiveReportTitle(title);
    setShareModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Saved Reports List */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-900">Custom Saved Reports</h2>
            <p className="text-xs text-zinc-500">Your personalized report configurations ready for immediate execution</p>
          </div>
          <button
            onClick={() => setScheduleModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-brand-green" /> Schedule New Report
          </button>
        </div>

        <div className="divide-y divide-zinc-100">
          {savedReports.map((rep) => (
            <div key={rep.id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-bold text-zinc-900">{rep.title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold uppercase">
                      {rep.type}
                    </span>
                    {rep.isScheduled && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                        Scheduled ({rep.scheduleFrequency})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">{rep.description}</p>
                  <div className="text-[11px] text-zinc-400">
                    Created by <span className="font-semibold text-zinc-700">{rep.createdBy}</span> • Last run: {rep.lastRunAt || 'Never'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                <button
                  onClick={() => handleRunReport(rep)}
                  className="px-3.5 py-2 rounded-2xl bg-brand-green text-black text-xs font-bold hover:bg-lime-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Run Now
                </button>
                <button
                  onClick={() => handleOpenShare(rep.title)}
                  className="px-3 py-2 rounded-2xl bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button
                  onClick={() => deleteSavedReport(rep.id)}
                  className="p-2 rounded-2xl bg-zinc-100 text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Delivery Schedules */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 pb-4">
          <h2 className="font-display text-lg font-bold text-zinc-900">Active Automated Report Schedules</h2>
          <p className="text-xs text-zinc-500">Recurring distribution schedules active across Slack and Email</p>
        </div>

        <div className="divide-y divide-zinc-100">
          {scheduledReports.map((sched) => (
            <div key={sched.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  sched.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-zinc-900">{sched.reportTitle}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sched.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sched.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Runs <strong>{sched.frequency}</strong> at {sched.timeOfDay} • Recipients: {sched.recipients.join(', ')}
                  </p>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Next run scheduled for: <strong>{sched.nextRunAt}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                <button
                  onClick={() => toggleScheduleStatus(sched.id)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  {sched.status === 'active' ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => deleteScheduledReport(sched.id)}
                  className="p-2 rounded-xl bg-zinc-100 text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ShareReportModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        reportTitle={activeReportTitle}
      />
      <ScheduleReportModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
}
