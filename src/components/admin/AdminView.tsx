import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Users,
  Building,
  Cpu,
  HardDrive,
  UserPlus,
  Search,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RolePermission } from '../../types';

import { SystemHealthView } from './SystemHealthView';
import { LogsView } from './LogsView';
import { AuditLogView } from './AuditLogView';
import { AlertsView } from './AlertsView';
import { BackupRecoveryView } from './BackupRecoveryView';
import { MetricsView } from './MetricsView';

export function AdminView() {
  const {
    adminStats,
    orgMembers,
    addOrgMember,
    deleteOrgMember,
    rolePermissions,
    updateRolePermissions,
    userInvitations,
    cancelInvitation,
    auditLogs,
    addAuditLog,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'users' | 'roles' | 'invitations' | 'audit' | 'config' | 'monitoring' | 'logs' | 'alerts' | 'backups' | 'metrics'
  >('overview');

  // Search & Filters for Users
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // New User Form Modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    role: 'Developer',
    department: 'Engineering Operations',
    team: 'Core Platform Team Alpha',
    employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  // Role Edit Matrix state
  const [selectedRole, setSelectedRole] = useState<RolePermission>(rolePermissions[0]);

  // Audit search
  const [auditSearch, setAuditSearch] = useState('');

  const filteredUsers = orgMembers.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.email) return;

    addOrgMember({
      fullName: newUserForm.fullName,
      email: newUserForm.email,
      role: newUserForm.role,
      department: newUserForm.department,
      team: newUserForm.team,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      employeeId: newUserForm.employeeId,
      onlineStatus: 'online',
    });

    addAuditLog('User Created', `Administrator created user account for ${newUserForm.email}`);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      fullName: '',
      email: '',
      role: 'Developer',
      department: 'Engineering Operations',
      team: 'Core Platform Team Alpha',
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  const filteredAudits = auditLogs.filter(
    (a) =>
      a.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.details.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-green text-black uppercase">
              Admin & Governance
            </span>
            <span className="text-xs font-mono text-zinc-400">Enterprise Control Plane</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            System Administration & Security
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            Centralized management for RBAC roles, tenant provisioning, audit telemetry, and infrastructure health.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-brand-green text-black font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          Provision User Account
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto text-xs font-medium">
        {[
          { id: 'overview', label: 'System Overview' },
          { id: 'users', label: 'User Provisioning' },
          { id: 'roles', label: 'RBAC Roles' },
          { id: 'invitations', label: 'Invitations' },
          { id: 'audit', label: 'Audit Logs' },
          { id: 'monitoring', label: 'System Health' },
          { id: 'logs', label: 'Service Logs' },
          { id: 'alerts', label: 'Alerts' },
          { id: 'backups', label: 'Backups' },
          { id: 'metrics', label: 'Metrics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === tab.id
                ? 'bg-zinc-900 text-white font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-2">
              <span className="text-zinc-400 font-mono text-[10px] uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-brand-green" /> Total Provisioned Users
              </span>
              <div className="font-display font-bold text-2xl text-zinc-900">{adminStats.totalUsers}</div>
              <p className="text-[11px] text-emerald-600 font-semibold">{adminStats.activeUsers} Active • {adminStats.onlineUsers} Online</p>
            </div>

            <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-2">
              <span className="text-zinc-400 font-mono text-[10px] uppercase flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-600" /> Workspaces & Orgs
              </span>
              <div className="font-display font-bold text-2xl text-zinc-900">{adminStats.totalWorkspaces}</div>
              <p className="text-[11px] text-zinc-500">{adminStats.totalOrganizations} Enterprise Tenancies</p>
            </div>

            <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-2">
              <span className="text-zinc-400 font-mono text-[10px] uppercase flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-amber-600" /> AI Tokens Consumed
              </span>
              <div className="font-display font-bold text-2xl text-zinc-900">{adminStats.aiUsageCredits}</div>
              <p className="text-[11px] text-zinc-500">{adminStats.apiRequestsToday} Requests Today</p>
            </div>

            <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-2">
              <span className="text-zinc-400 font-mono text-[10px] uppercase flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-rose-600" /> Storage Capacity
              </span>
              <div className="font-display font-bold text-2xl text-zinc-900">{adminStats.storageUsageGb} / 500 GB</div>
              <p className="text-[11px] text-zinc-500">PostgreSQL + Asset Storage</p>
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> System Microservices Health
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-900">API Gateway</h4>
                  <p className="text-emerald-700 text-[11px]">Node.js Express Cluster</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 font-mono font-bold text-[10px]">99.98% Uptime</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-900">AI Python FastAPIs</h4>
                  <p className="text-emerald-700 text-[11px]">LangGraph Agent Swarm</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 font-mono font-bold text-[10px]">Healthy</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-900">PostgreSQL DB</h4>
                  <p className="text-emerald-700 text-[11px]">Drizzle ORM Connection Pool</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 font-mono font-bold text-[10px]">12ms Latency</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-zinc-200 focus:outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs"
            >
              <option value="all">All Roles</option>
              {rolePermissions.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={user.avatar} alt={user.fullName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-zinc-900">{user.fullName}</div>
                        <div className="text-[11px] text-zinc-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-800">{user.role}</td>
                    <td className="px-6 py-4 text-zinc-600">{user.department}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteOrgMember(user.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete User"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeAdminTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
              System Roles ({rolePermissions.length})
            </h3>
            {rolePermissions.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedRole.id === role.id
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                    : 'bg-white/80 text-zinc-900 border-white/90 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">{role.name}</h4>
                  <span className={`text-[10px] font-mono ${selectedRole.id === role.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {role.memberCount} Users
                  </span>
                </div>
                <p className={`text-xs mt-1 line-clamp-2 ${selectedRole.id === role.id ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {role.description}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="font-display text-lg font-bold text-zinc-900">
                Permission Matrix: {selectedRole.name}
              </h3>
              <p className="text-xs text-zinc-500">{selectedRole.description}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <div className="font-bold text-zinc-900">Admin Permissions</div>
                <div className="text-zinc-600 font-mono text-[11px]">
                  {selectedRole.permissions.admin.join(', ') || 'None'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <div className="font-bold text-zinc-900">Project Permissions</div>
                <div className="text-zinc-600 font-mono text-[11px]">
                  {selectedRole.permissions.projects.join(', ') || 'None'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <div className="font-bold text-zinc-900">AI Features</div>
                <div className="text-zinc-600 font-mono text-[11px]">
                  {selectedRole.permissions.aiFeatures.join(', ') || 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invitations Tab */}
      {activeAdminTab === 'invitations' && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
            Pending Invitations ({userInvitations.length})
          </h3>

          <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono text-[10px] uppercase">
                <tr>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Invited At</th>
                  <th className="px-6 py-3.5">Expires At</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {userInvitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4 font-bold text-zinc-900">{inv.email}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-700">{inv.role}</td>
                    <td className="px-6 py-4 font-mono text-zinc-500">{inv.invitedAt}</td>
                    <td className="px-6 py-4 font-mono text-zinc-500">{inv.expiresAt}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => cancelInvitation(inv.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeAdminTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit actions..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono text-[10px] uppercase">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Action</th>
                  <th className="px-6 py-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredAudits.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4 font-mono text-zinc-500">{log.timestamp}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900">{log.user}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-800">{log.action}</td>
                    <td className="px-6 py-4 text-zinc-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Additional Management Views */}
      {activeAdminTab === 'monitoring' && <SystemHealthView />}
      {activeAdminTab === 'logs' && <LogsView />}
      {activeAdminTab === 'alerts' && <AlertsView />}
      {activeAdminTab === 'backups' && <BackupRecoveryView />}
      {activeAdminTab === 'metrics' && <MetricsView />}

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-zinc-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-zinc-900">Provision User Account</h2>
                  <p className="text-xs text-zinc-500">Directly create a user record in PostgreSQL.</p>
                </div>
                <button
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Full Name</label>
                  <input
                    type="text"
                    value={newUserForm.fullName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Email Address</label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="jane@agilepulse.ai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    {rolePermissions.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md cursor-pointer"
                  >
                    Provision Account
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
