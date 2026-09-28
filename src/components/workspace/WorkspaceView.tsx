import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Plus,
  Edit3,
  Archive,
  RotateCcw,
  Trash2,
  Share2,
  Globe,
  Clock,
  Calendar,
  DollarSign,
  Users,
  FolderGit2,
  Check,
  X,
  Building,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Workspace } from '../../types';

export function WorkspaceView() {
  const {
    workspaces,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setToastMessage,
  } = useApp();

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(workspaces[0]?.id || 'ws-001');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [newOwnerEmail, setNewOwnerEmail] = useState('');

  const activeWs = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const [createForm, setCreateForm] = useState({
    name: '',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100',
    description: '',
    domain: '',
    timeZone: 'America/New_York (UTC-5)',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workingHours: { start: '09:00', end: '17:00' },
    sprintDurationWeeks: 2,
    currency: 'USD ($)',
    dateFormat: 'YYYY-MM-DD',
    status: 'active' as const,
    ownerId: 'usr-101',
  });

  const [editForm, setEditForm] = useState<Workspace>(activeWs || ({} as Workspace));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name) return;
    addWorkspace(createForm);
    setIsCreateModalOpen(false);
    setCreateForm({
      name: '',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100',
      description: '',
      domain: '',
      timeZone: 'America/New_York (UTC-5)',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      workingHours: { start: '09:00', end: '17:00' },
      sprintDurationWeeks: 2,
      currency: 'USD ($)',
      dateFormat: 'YYYY-MM-DD',
      status: 'active',
      ownerId: 'usr-101',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace(editForm.id, editForm);
    setIsEditModalOpen(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOwnerEmail) return;
    setToastMessage(`Ownership of "${activeWs.name}" transferred to ${newOwnerEmail}`);
    setIsTransferModalOpen(false);
    setNewOwnerEmail('');
  };

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-black uppercase">
              Enterprise Hub
            </span>
            <span className="text-xs font-mono text-zinc-400">Multi-Workspace Architecture</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            Workspace & Tenant Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            Configure isolated team domains, working hours, sprint defaults, and currency settings.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Workspace
        </button>
      </div>

      {/* Grid Layout: Workspace Selector Sidebar + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workspace Selector List */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
            All Workspaces ({workspaces.length})
          </h2>

          <div className="space-y-3">
            {workspaces.map((ws) => {
              const isSelected = ws.id === activeWorkspaceId;
              return (
                <div
                  key={ws.id}
                  onClick={() => setActiveWorkspaceId(ws.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl scale-[1.02]'
                      : 'bg-white/80 backdrop-blur-md border-white/90 text-zinc-900 hover:border-zinc-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ws.logo}
                        alt={ws.name}
                        className="w-10 h-10 rounded-xl object-cover border border-zinc-700 bg-zinc-800"
                      />
                      <div>
                        <h3 className="font-bold text-sm leading-tight">{ws.name}</h3>
                        <p className={`text-[11px] font-mono ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {ws.domain}
                        </p>
                      </div>
                    </div>
                    {ws.status === 'archived' ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        Archived
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                        Active
                      </span>
                    )}
                  </div>

                  <p className={`text-xs line-clamp-2 ${isSelected ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {ws.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-200/20 text-[11px]">
                    <span className="flex items-center gap-1 opacity-80">
                      <Users className="w-3.5 h-3.5" /> {ws.memberCount} Members
                    </span>
                    <span className="flex items-center gap-1 opacity-80">
                      <FolderGit2 className="w-3.5 h-3.5" /> {ws.projectCount} Projects
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Workspace Active View & Settings */}
        {activeWs && (
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6">
              {/* Header Details */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={activeWs.logo}
                    alt={activeWs.name}
                    className="w-14 h-14 rounded-2xl object-cover border shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-xl font-bold text-zinc-900">{activeWs.name}</h2>
                      {activeWs.status === 'active' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 font-bold">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3.5 h-3.5 text-zinc-400" /> https://{activeWs.domain}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setEditForm(activeWs);
                      setIsEditModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Details
                  </button>
                  <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Transfer Owner
                  </button>
                  {activeWs.status === 'active' ? (
                    <button
                      onClick={() => updateWorkspace(activeWs.id, { status: 'archived' })}
                      className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs flex items-center gap-1"
                    >
                      <Archive className="w-3.5 h-3.5" /> Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => updateWorkspace(activeWs.id, { status: 'active' })}
                      className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                  )}
                  <button
                    onClick={() => deleteWorkspace(activeWs.id)}
                    className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description & Metadata */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
                  Workspace Description
                </h3>
                <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  {activeWs.description}
                </p>
              </div>

              {/* Configuration Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
                  <span className="text-zinc-400 font-mono text-[10px] uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time Zone
                  </span>
                  <p className="font-bold text-zinc-900">{activeWs.timeZone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
                  <span className="text-zinc-400 font-mono text-[10px] uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Working Hours & Days
                  </span>
                  <p className="font-bold text-zinc-900">
                    {activeWs.workingHours.start} - {activeWs.workingHours.end} ({activeWs.workingDays.join(', ')})
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
                  <span className="text-zinc-400 font-mono text-[10px] uppercase flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Default Sprint Duration
                  </span>
                  <p className="font-bold text-zinc-900">{activeWs.sprintDurationWeeks} Weeks Cycle</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
                  <span className="text-zinc-400 font-mono text-[10px] uppercase flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Currency & Date Format
                  </span>
                  <p className="font-bold text-zinc-900">
                    {activeWs.currency} • {activeWs.dateFormat}
                  </p>
                </div>
              </div>

              {/* Security & Access Review */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-zinc-900">Enterprise Tenant Isolation Active</h4>
                    <p className="text-zinc-600">
                      All metrics, sprint predictive models, and tasks are securely isolated within domain{' '}
                      <strong>{activeWs.domain}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Workspace Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-zinc-100 my-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-zinc-900">Create New Workspace</h2>
                  <p className="text-xs text-zinc-500">Add an isolated workspace for a new division or business unit.</p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Workspace Name</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. AI Innovation Lab"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Subdomain Prefix</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={createForm.domain}
                      onChange={(e) => setCreateForm({ ...createForm, domain: e.target.value })}
                      placeholder="ai-lab"
                      className="w-full px-3.5 py-2.5 rounded-l-xl border border-r-0 border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                    <span className="px-3 py-2.5 bg-zinc-100 border border-zinc-200 text-zinc-500 font-mono rounded-r-xl">
                      .agilepulse.ai
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Description</label>
                  <textarea
                    rows={3}
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Workspace purpose and scope..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Sprint Duration</label>
                    <select
                      value={createForm.sprintDurationWeeks}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, sprintDurationWeeks: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    >
                      <option value={1}>1 Week</option>
                      <option value={2}>2 Weeks (Standard)</option>
                      <option value={3}>3 Weeks</option>
                      <option value={4}>4 Weeks</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Currency</label>
                    <select
                      value={createForm.currency}
                      onChange={(e) => setCreateForm({ ...createForm, currency: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    >
                      <option value="USD ($)">USD ($)</option>
                      <option value="EUR (€)">EUR (€)</option>
                      <option value="GBP (£)">GBP (£)</option>
                      <option value="JPY (¥)">JPY (¥)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md"
                  >
                    Create Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Workspace Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-zinc-100 my-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-zinc-900">Edit Workspace Details</h2>
                  <p className="text-xs text-zinc-500">Modify configuration and defaults for {editForm.name}.</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Workspace Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Domain / Subdomain</label>
                  <input
                    type="text"
                    value={editForm.domain}
                    onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Description</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Ownership Modal */}
      <AnimatePresence>
        {isTransferModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-zinc-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-zinc-900">Transfer Workspace Ownership</h2>
                  <p className="text-xs text-zinc-500">Transfer administrative ownership of {activeWs?.name}.</p>
                </div>
                <button
                  onClick={() => setIsTransferModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">New Owner Email Address</label>
                  <input
                    type="email"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    placeholder="new.owner@agilepulse.ai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-md"
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
