import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Search,
  Filter,
  ShieldAlert,
  ChevronRight,
  MoreVertical,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { TaskModal } from './TaskModal';

export function SprintBoard() {
  const { tasks, updateTaskStatus, toggleTaskBlocker, deleteTask, teamMembers, activeSprint } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatusForModal, setSelectedStatusForModal] = useState<TaskStatus>('todo');
  const [searchFilter, setSearchFilter] = useState('');
  const [epicFilter, setEpicFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [blockerModalTaskId, setBlockerModalTaskId] = useState<string | null>(null);
  const [blockerReasonInput, setBlockerReasonInput] = useState('');

  const columns: { id: TaskStatus; label: string; badgeColor: string }[] = [
    { id: 'todo', label: 'To Do', badgeColor: 'bg-zinc-200 text-zinc-800' },
    { id: 'in_progress', label: 'In Progress', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'code_review', label: 'Code Review', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'testing', label: 'Testing / QA', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'done', label: 'Done', badgeColor: 'bg-emerald-100 text-emerald-800' },
  ];

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      task.id.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesEpic = epicFilter === 'all' || task.epic === epicFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assigneeId === assigneeFilter;

    return matchesSearch && matchesEpic && matchesAssignee;
  });

  const openAddTaskModal = (status: TaskStatus = 'todo') => {
    setSelectedStatusForModal(status);
    setIsModalOpen(true);
  };

  const handleBlockerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (blockerModalTaskId) {
      toggleTaskBlocker(blockerModalTaskId, blockerReasonInput);
      setBlockerModalTaskId(null);
      setBlockerReasonInput('');
    }
  };

  const getPriorityStyle = (p: TaskPriority) => {
    switch (p) {
      case 'critical':
        return 'bg-red-500 text-white font-bold';
      case 'high':
        return 'bg-amber-500 text-white font-bold';
      case 'medium':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-zinc-500 text-white';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-zinc-900">Sprint 24 Interactive Board</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-green text-black uppercase">
              {tasks.length} Tasks
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Drag/move tasks across columns. AI continuously recalculates sprint velocity & risk status.
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search task title..."
              className="pl-9 pr-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-xs focus:outline-none focus:border-brand-green w-44 md:w-56"
            />
          </div>

          {/* Epic Filter */}
          <select
            value={epicFilter}
            onChange={(e) => setEpicFilter(e.target.value)}
            className="px-3 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 focus:outline-none"
          >
            <option value="all">All Epics</option>
            <option value="AI Intelligence">AI Intelligence</option>
            <option value="Security & Auth">Security & Auth</option>
            <option value="Dashboard UI">Dashboard UI</option>
            <option value="Analytics">Analytics</option>
            <option value="Reporting">Reporting</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 focus:outline-none"
          >
            <option value="all">All Assignees</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Create Task Button */}
          <button
            onClick={() => openAddTaskModal('todo')}
            className="px-4 py-2 rounded-full bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-brand-green" /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const colPoints = colTasks.reduce((acc, t) => acc + t.storyPoints, 0);

          return (
            <div
              key={col.id}
              className="p-4 rounded-3xl bg-zinc-100/70 border border-zinc-200/80 min-h-[600px] flex flex-col justify-between"
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${col.badgeColor}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 font-bold">({colTasks.length})</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 font-semibold">{colPoints} pts</span>
                </div>

                {/* Task Cards List */}
                <div className="space-y-3.5">
                  {colTasks.map((task) => {
                    const assignee = teamMembers.find((m) => m.id === task.assigneeId);

                    return (
                      <motion.div
                        layout
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border transition-all ${
                          task.blocked
                            ? 'bg-red-50/90 border-red-300 shadow-sm'
                            : 'bg-white border-white shadow-xs hover:shadow-md'
                        }`}
                      >
                        {/* Top ID & Priority Row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-bold text-zinc-500">{task.id}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${getPriorityStyle(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800">
                              {task.storyPoints} pts
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-sm text-zinc-900 mt-2 leading-snug">{task.title}</h4>

                        {/* Blocker Alert Banner */}
                        {task.blocked && (
                          <div className="mt-2 p-2 rounded-xl bg-red-100/80 border border-red-200 text-[11px] text-red-900 font-medium flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                            <span>
                              <strong>BLOCKED:</strong> {task.blockerReason}
                            </span>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {task.tags.map((tag) => (
                            <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Assignee & Controls Footer */}
                        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                          {/* Assignee */}
                          <div className="flex items-center gap-2">
                            {assignee ? (
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-6 h-6 rounded-full object-cover border border-zinc-200"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px]">
                                ?
                              </div>
                            )}
                            <span className="text-xs text-zinc-600 font-medium truncate max-w-[80px]">
                              {assignee?.name.split(' ')[0] || 'Unassigned'}
                            </span>
                          </div>

                          {/* Quick Controls */}
                          <div className="flex items-center gap-1">
                            {/* Blocker Toggle */}
                            <button
                              onClick={() => {
                                if (task.blocked) {
                                  toggleTaskBlocker(task.id);
                                } else {
                                  setBlockerModalTaskId(task.id);
                                }
                              }}
                              className={`p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
                                task.blocked
                                  ? 'bg-red-200 text-red-900 hover:bg-red-300'
                                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                              }`}
                              title={task.blocked ? 'Clear Blocker' : 'Flag Blocker'}
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </button>

                            {/* Status Shift Selector */}
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                              className="bg-zinc-100 border border-zinc-200 text-[10px] font-bold rounded-lg px-2 py-1 text-zinc-800 focus:outline-none cursor-pointer hover:bg-zinc-200"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Prog</option>
                              <option value="code_review">Review</option>
                              <option value="testing">Testing</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Add Task Button at bottom of column */}
              <button
                onClick={() => openAddTaskModal(col.id)}
                className="w-full mt-4 py-2.5 rounded-2xl border border-dashed border-zinc-300 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add to {col.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultStatus={selectedStatusForModal}
      />

      {/* Blocker Reason Modal */}
      {blockerModalTaskId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Flag Task Blocker
              </h3>
              <button onClick={() => setBlockerModalTaskId(null)} className="text-zinc-400 hover:text-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBlockerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  Reason for Blocker *
                </label>
                <input
                  type="text"
                  required
                  value={blockerReasonInput}
                  onChange={(e) => setBlockerReasonInput(e.target.value)}
                  placeholder="e.g. Waiting for SecOps Compliance Review"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-red-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setBlockerModalTaskId(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold text-xs hover:bg-red-700 shadow-sm"
                >
                  Flag as Blocked
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
