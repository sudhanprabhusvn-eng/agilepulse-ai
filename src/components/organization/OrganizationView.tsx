import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Users,
  Briefcase,
  Search,
  Filter,
  Grid,
  List,
  UserPlus,
  Plus,
  Mail,
  Shield,
  Layers,
  CheckCircle2,
  MoreVertical,
  X,
  Upload,
  ChevronRight,
  Sparkles,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrgMember, OrganizationTeam } from '../../types';

export function OrganizationView() {
  const {
    departments,
    organizationTeams,
    addTeam,
    deleteTeam,
    orgMembers,
    addOrgMember,
    updateOrgMember,
    deleteOrgMember,
    createInvitation,
    setToastMessage,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'teams' | 'departments'>('directory');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isBulkInviteModalOpen, setIsBulkInviteModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

  // Invite Form
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'Developer',
    department: departments[0]?.name || 'Engineering Operations',
    team: organizationTeams[0]?.name || 'Core Platform Team Alpha',
    workspace: 'Core Product & AI Engineering',
  });

  // Bulk Invite Form
  const [bulkEmailsText, setBulkEmailsText] = useState('');

  // Add Team Form
  const [teamForm, setTeamForm] = useState({
    name: '',
    departmentId: departments[0]?.id || 'dept-01',
    departmentName: departments[0]?.name || 'Engineering Operations',
    leadName: 'Sarah Jenkins',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    memberIds: ['usr-101'],
    description: '',
  });

  // Filter members
  const filteredMembers = orgMembers.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'all' || m.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email) return;
    createInvitation(inviteForm);
    setIsInviteModalOpen(false);
    setInviteForm({
      email: '',
      role: 'Developer',
      department: departments[0]?.name || 'Engineering Operations',
      team: organizationTeams[0]?.name || 'Core Platform Team Alpha',
      workspace: 'Core Product & AI Engineering',
    });
  };

  const handleBulkInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = bulkEmailsText
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes('@'));
    if (emails.length === 0) return;

    emails.forEach((email) => {
      createInvitation({
        email,
        role: 'Developer',
        department: 'Engineering Operations',
        team: 'Core Platform Team Alpha',
        workspace: 'Core Product & AI Engineering',
      });
    });

    setToastMessage(`Bulk invitations dispatched to ${emails.length} recipients.`);
    setIsBulkInviteModalOpen(false);
    setBulkEmailsText('');
  };

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name) return;
    addTeam(teamForm);
    setIsAddTeamModalOpen(false);
    setTeamForm({
      name: '',
      departmentId: departments[0]?.id || 'dept-01',
      departmentName: departments[0]?.name || 'Engineering Operations',
      leadName: 'Sarah Jenkins',
      leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      memberIds: ['usr-101'],
      description: '',
    });
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-black uppercase">
              Organization Hierarchy
            </span>
            <span className="text-xs font-mono text-zinc-400">AgilePulse Enterprise</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            Organization & Team Directory
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            Manage departmental hierarchy, team assignments, member roles, and bulk invitations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setIsBulkInviteModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Bulk Invite
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Invite Member
          </button>
        </div>
      </div>

      {/* Subtab Navigation Pills */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'directory'
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-white/80 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Users className="w-4 h-4" /> Member Directory ({orgMembers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('teams')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'teams'
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-white/80 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Layers className="w-4 h-4" /> Teams ({organizationTeams.length})
          </button>
          <button
            onClick={() => setActiveSubTab('departments')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'departments'
                ? 'bg-zinc-900 text-white shadow-md'
                : 'bg-white/80 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Building2 className="w-4 h-4" /> Departments ({departments.length})
          </button>
        </div>

        {activeSubTab === 'directory' && (
          <div className="flex items-center gap-2 bg-white/80 border border-zinc-200 p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs transition-all ${
                viewMode === 'grid' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs transition-all ${
                viewMode === 'table' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeSubTab === 'teams' && (
          <button
            onClick={() => setIsAddTeamModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 text-white font-bold text-xs shadow-md hover:bg-black transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Team
          </button>
        )}
      </div>

      {/* Directory Content */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member name, email, or role..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto text-xs">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-zinc-200 bg-white focus:outline-none"
                >
                  <option value="all">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 bg-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={m.avatar}
                          alt={m.fullName}
                          className="w-12 h-12 rounded-2xl object-cover bg-zinc-900 border"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            m.onlineStatus === 'online'
                              ? 'bg-emerald-500'
                              : m.onlineStatus === 'busy'
                              ? 'bg-rose-500'
                              : m.onlineStatus === 'away'
                              ? 'bg-amber-500'
                              : 'bg-zinc-400'
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900">{m.fullName}</h3>
                        <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {m.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteOrgMember(m.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-600">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" /> {m.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" /> {m.department}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-zinc-400" /> {m.team}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>ID: {m.employeeId}</span>
                    <span>Active: {m.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="px-6 py-3.5">Member Name</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Department</th>
                      <th className="px-6 py-3.5">Team</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Joined</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-zinc-50/50">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={m.avatar}
                            alt={m.fullName}
                            className="w-8 h-8 rounded-xl object-cover bg-zinc-900"
                          />
                          <div>
                            <div className="font-bold text-zinc-900">{m.fullName}</div>
                            <div className="text-[11px] text-zinc-500">{m.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-zinc-800">{m.role}</td>
                        <td className="px-6 py-4 text-zinc-600">{m.department}</td>
                        <td className="px-6 py-4 text-zinc-600">{m.team}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 uppercase">
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-500">{m.joinedDate}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteOrgMember(m.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teams Subtab */}
      {activeSubTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizationTeams.map((team) => (
            <div
              key={team.id}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-zinc-900">{team.name}</h3>
                  <p className="text-xs text-zinc-500">{team.departmentName}</p>
                </div>
                <button
                  onClick={() => deleteTeam(team.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                {team.description}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={team.leadAvatar}
                  alt={team.leadName}
                  className="w-8 h-8 rounded-xl object-cover bg-zinc-900"
                />
                <div className="text-xs">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono block">Team Lead</span>
                  <strong className="font-bold text-zinc-900">{team.leadName}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 block">Avg Velocity</span>
                  <span className="font-bold text-emerald-600">{team.sprintVelocityAvg} pts/sprint</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 block">Active Projects</span>
                  <span className="font-bold text-zinc-900">{team.activeProjectsCount} Projects</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Departments Subtab */}
      {activeSubTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold font-mono text-xs">
                    {dept.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900">{dept.name}</h3>
                    <p className="text-xs text-zinc-500">{dept.teamCount} Teams • {dept.memberCount} Members</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                {dept.description}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={dept.headAvatar}
                  alt={dept.headName}
                  className="w-8 h-8 rounded-xl object-cover bg-zinc-900"
                />
                <div className="text-xs">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono block">Department Head</span>
                  <strong className="font-bold text-zinc-900">{dept.headName}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-zinc-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-zinc-900">Invite New Team Member</h2>
                  <p className="text-xs text-zinc-500">Send an invitation email to join AgilePulse.</p>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Email Address</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="colleague@agilepulse.ai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Assigned Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="Scrum Master">Scrum Master</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Product Owner">Product Owner</option>
                    <option value="Developer">Developer</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Invite Modal */}
      <AnimatePresence>
        {isBulkInviteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-zinc-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-zinc-900">Bulk Invite Members</h2>
                  <p className="text-xs text-zinc-500">Paste multiple email addresses separated by commas or lines.</p>
                </div>
                <button
                  onClick={() => setIsBulkInviteModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBulkInviteSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Email Addresses</label>
                  <textarea
                    rows={5}
                    value={bulkEmailsText}
                    onChange={(e) => setBulkEmailsText(e.target.value)}
                    placeholder="alex@agilepulse.ai&#10;sarah@agilepulse.ai&#10;marcus@agilepulse.ai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono text-xs"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsBulkInviteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-md"
                  >
                    Dispatch Bulk Invites
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Team Modal */}
      <AnimatePresence>
        {isAddTeamModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-zinc-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-zinc-900">Create New Agile Team</h2>
                  <p className="text-xs text-zinc-500">Define team scope, lead, and department assignment.</p>
                </div>
                <button
                  onClick={() => setIsAddTeamModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTeamSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Team Name</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    placeholder="e.g. Data Pipeline Squad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Department</label>
                  <select
                    value={teamForm.departmentName}
                    onChange={(e) => setTeamForm({ ...teamForm, departmentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Description</label>
                  <textarea
                    rows={2}
                    value={teamForm.description}
                    onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsAddTeamModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-md"
                  >
                    Save Team
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
