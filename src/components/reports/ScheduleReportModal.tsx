import React, { useState } from 'react';
import { X, Calendar, Clock, Mail, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportScheduleFrequency, ReportFormat } from '../../types';

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId?: string;
  reportTitle?: string;
}

export function ScheduleReportModal({ isOpen, onClose, reportId, reportTitle }: ScheduleReportModalProps) {
  const { createSchedule, savedReports, currentUser } = useApp();
  const [selectedReportId, setSelectedReportId] = useState(reportId || savedReports[0]?.id || 'rep-saved-001');
  const [frequency, setFrequency] = useState<ReportScheduleFrequency>('weekly');
  const [timeOfDay, setTimeOfDay] = useState('09:00 AM');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [recipient, setRecipient] = useState(currentUser.email);

  if (!isOpen) return null;

  const currentRep = savedReports.find((r) => r.id === selectedReportId) || savedReports[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSchedule({
      reportId: currentRep.id,
      reportTitle: currentRep.title,
      frequency,
      timeOfDay,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      recipients: [recipient],
      format,
      status: 'active',
      createdByName: currentUser.name,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-zinc-200 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-brand-green flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-900">Schedule Automated Delivery</h2>
            <p className="text-xs text-zinc-500">Recurring email & Slack distribution engine</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Report Selection */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 block">Select Saved Report</label>
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3.5 py-2.5 font-medium text-zinc-900 focus:outline-none focus:border-zinc-900"
            >
              {savedReports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.type.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 block">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as ReportScheduleFrequency)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 font-medium text-zinc-900"
              >
                <option value="daily">Daily Briefing</option>
                <option value="weekly">Weekly Briefing</option>
                <option value="sprint_end">Every Sprint End</option>
                <option value="monthly">Monthly Audit</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 block">Time of Day</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 font-medium text-zinc-900"
              >
                <option value="08:00 AM">08:00 AM PST</option>
                <option value="09:00 AM">09:00 AM PST</option>
                <option value="12:00 PM">12:00 PM PST</option>
                <option value="17:00 PM">05:00 PM PST</option>
              </select>
            </div>
          </div>

          {frequency === 'weekly' && (
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 block">Day of Week</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 font-medium text-zinc-900"
              >
                <option value="Monday">Every Monday</option>
                <option value="Wednesday">Every Wednesday</option>
                <option value="Friday">Every Friday</option>
              </select>
            </div>
          )}

          {/* Format & Recipient */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 block">Export Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ReportFormat)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 font-medium text-zinc-900"
              >
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet (XLSX)</option>
                <option value="csv">CSV Data File</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 block">Recipient Email</label>
              <input
                type="email"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 font-medium text-zinc-900"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-brand-green" /> Activate Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
