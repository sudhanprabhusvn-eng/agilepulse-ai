import React, { useState } from 'react';
import { X, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { TaskPriority, TaskStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
}

export function TaskModal({ isOpen, onClose, defaultStatus = 'todo' }: TaskModalProps) {
  const { addTask, teamMembers } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [storyPoints, setStoryPoints] = useState(3);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState(teamMembers[0]?.id || 'm-1');
  const [epic, setEpic] = useState('AI Intelligence');
  const [tagsInput, setTagsInput] = useState('Frontend, React');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    addTask({
      title,
      description,
      storyPoints: Number(storyPoints),
      priority,
      assigneeId,
      epic,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status,
      blocked: false,
      tags,
    });

    // Reset
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-zinc-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-brand-green flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-zinc-900">Create New Agile Task</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-zinc-800">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement WebSocket live telemetry stream"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-brand-green text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed acceptance criteria or technical notes..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-brand-green text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Story Points
              </label>
              <select
                value={storyPoints}
                onChange={(e) => setStoryPoints(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-brand-green text-sm font-semibold"
              >
                {[1, 2, 3, 5, 8, 13].map((pts) => (
                  <option key={pts} value={pts}>
                    {pts} pts {pts >= 8 ? '(High Complexity)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-brand-green text-sm font-semibold"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical 🔥</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-brand-green text-sm"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Epic Category
              </label>
              <select
                value={epic}
                onChange={(e) => setEpic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-brand-green text-sm"
              >
                <option value="AI Intelligence">AI Intelligence</option>
                <option value="Security & Auth">Security & Auth</option>
                <option value="Dashboard UI">Dashboard UI</option>
                <option value="Analytics">Analytics</option>
                <option value="Reporting">Reporting</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Frontend, API, Database"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-brand-green text-sm"
            />
          </div>

          {/* AI Risk Preview Note */}
          {Number(storyPoints) >= 8 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>AI Note:</strong> Tasks estimated at 8+ story points carry a higher risk score of scope slip. Consider splitting into smaller sub-tasks.
              </span>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-zinc-600 hover:text-zinc-900 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              Create Task <Sparkles className="w-4 h-4 text-brand-green" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
