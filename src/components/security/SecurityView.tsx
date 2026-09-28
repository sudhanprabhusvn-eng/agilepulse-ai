import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Key,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Shield,
  UserCheck,
  X,
  Sparkles,
  QrCode,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function SecurityView() {
  const {
    userSessions,
    terminateSession,
    terminateAllOtherSessions,
    loginHistory,
    securityStatus,
    updateSecurityStatus,
    currentUser,
    setToastMessage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'password' | '2fa' | 'sessions' | 'history' | 'privacy'>('dashboard');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // 2FA state
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Login history filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'all' | 'success' | 'failed'>('all');

  const calcPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-zinc-200' };
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 12) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 50) return { score, label: 'Medium', color: 'bg-amber-500' };
    if (score <= 75) return { score, label: 'Strong', color: 'bg-emerald-400' };
    return { score, label: 'Very Strong', color: 'bg-emerald-600' };
  };

  const passStrength = calcPasswordStrength(newPassword);

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let generated = '';
    for (let i = 0; i < 16; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(generated);
    setConfirmPassword(generated);
    setShowPass(true);
    setToastMessage('Generated 16-character secure password!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToastMessage('New passwords do not match!');
      return;
    }
    setToastMessage('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const filteredHistory = loginHistory.filter((log) => {
    const matchesSearch =
      log.ipAddress.includes(historySearch) ||
      log.device.toLowerCase().includes(historySearch.toLowerCase()) ||
      log.location.toLowerCase().includes(historySearch.toLowerCase());
    const matchesStatus = historyStatusFilter === 'all' || log.status === historyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-8">
      {/* Title Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-black uppercase">
              Zero-Trust Security
            </span>
            <span className="text-xs font-mono text-zinc-400">SOC2 Type II Compliant</span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            Security & Session Control
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
            Monitor login activity, active sessions, 2FA credentials, password policies, and privacy flags.
          </p>
        </div>

        {/* Security Score Widget */}
        <div className="p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center gap-4 shrink-0">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 font-display font-bold text-lg">
            {securityStatus.securityScore}
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Security Score</span>
            <span className="font-bold text-sm text-white">{securityStatus.accountProtectionStatus}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">2FA & Session Encryption Active</span>
          </div>
        </div>
      </div>

      {/* Subtab Pill Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-200/80">
        {[
          { id: 'dashboard', label: 'Overview', icon: ShieldCheck },
          { id: 'password', label: 'Password', icon: Key },
          { id: '2fa', label: 'Two-Factor Auth', icon: Smartphone },
          { id: 'sessions', label: 'Active Sessions', icon: Laptop },
          { id: 'history', label: 'Login History', icon: Clock },
          { id: 'privacy', label: 'Privacy & Consent', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'bg-white/80 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase">2FA Authenticator</span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-base text-zinc-900">
                  {securityStatus.twoFactorEnabled ? 'Enabled & Active' : 'Disabled'}
                </span>
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-zinc-500">Google Authenticator or YubiKey active.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase">Password Hygiene</span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-base text-zinc-900">{securityStatus.passwordStrength}</span>
                <span className="text-xs font-mono text-zinc-500">{securityStatus.passwordLastChanged}</span>
              </div>
              <p className="text-[11px] text-zinc-500">16+ characters with mixed case and symbols.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase">Active Sessions</span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-base text-zinc-900">{userSessions.length} Devices</span>
                <button
                  onClick={terminateAllOtherSessions}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Revoke Others
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">Includes current MacBook Pro sonar link.</p>
            </div>
          </div>

          {/* Role & Access Review */}
          <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" /> Role & Privilege Assessment
            </h3>
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-mono block">Current Role</span>
                <strong className="font-bold text-zinc-900">{currentUser.role}</strong>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-mono block">Tenant Organization</span>
                <strong className="font-bold text-zinc-900">{currentUser.organization}</strong>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-mono block">Audit Logging</span>
                <strong className="font-bold text-emerald-600">Full Realtime Telemetry</strong>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-mono block">SSO Provider</span>
                <strong className="font-bold text-zinc-900">Google OAuth 2.0</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6 max-w-2xl">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-600" /> Password Management
            </h3>
            <p className="text-xs text-zinc-500">Change your password and run real-time strength validation.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-zinc-700">New Password</label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Generate Secure Password
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              {newPassword && (
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Password Strength: {passStrength.label}</span>
                    <span>{passStrength.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passStrength.color}`}
                      style={{ width: `${passStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-md"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2FA Tab */}
      {activeTab === '2fa' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6">
          <div className="border-b border-zinc-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" /> Two-Factor Authentication (2FA)
              </h3>
              <p className="text-xs text-zinc-500">Protect your account with TOTP authenticator apps.</p>
            </div>

            <button
              onClick={() => {
                updateSecurityStatus({ twoFactorEnabled: !securityStatus.twoFactorEnabled });
                if (!securityStatus.twoFactorEnabled) setIs2FAModalOpen(true);
              }}
              className={`px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all ${
                securityStatus.twoFactorEnabled
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400'
              }`}
            >
              {securityStatus.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3 text-xs">
            <h4 className="font-bold text-zinc-900 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" /> Backup Recovery Codes ({securityStatus.backupCodesRemaining} Codes Left)
            </h4>
            <p className="text-zinc-600">
              Download one-time recovery codes to log in if you lose access to your primary device.
            </p>
            <button
              onClick={() => setToastMessage('Downloaded 10 fresh recovery backup codes.')}
              className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-800 font-bold hover:bg-zinc-100 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Recovery Codes
            </button>
          </div>
        </div>
      )}

      {/* Active Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
              Connected Sessions ({userSessions.length})
            </h3>
            <button
              onClick={terminateAllOtherSessions}
              className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs"
            >
              Terminate All Other Sessions
            </button>
          </div>

          <div className="space-y-3">
            {userSessions.map((sess) => (
              <div
                key={sess.id}
                className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-zinc-900 text-white">
                    {sess.deviceName.includes('iPhone') ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-zinc-900">{sess.deviceName}</h4>
                      {sess.isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          Current Device
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {sess.browser} • {sess.os} • IP: {sess.ipAddress} ({sess.location})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-400">{sess.lastActive}</span>
                  {!sess.isCurrent && (
                    <button
                      onClick={() => terminateSession(sess.id)}
                      className="p-2 text-zinc-400 hover:text-rose-600 rounded-xl hover:bg-rose-50"
                      title="Terminate Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Login History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search IP, location, device..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-zinc-200 focus:outline-none"
              />
            </div>

            <select
              value={historyStatusFilter}
              onChange={(e) => setHistoryStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs"
            >
              <option value="all">All Events</option>
              <option value="success">Successful Logins</option>
              <option value="failed">Failed Attempts</option>
            </select>
          </div>

          <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono text-[10px] uppercase">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">IP Address</th>
                  <th className="px-6 py-3.5">Device & Browser</th>
                  <th className="px-6 py-3.5">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4 font-mono text-zinc-700">{log.timestamp}</td>
                    <td className="px-6 py-4">
                      {log.status === 'success' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                          SUCCESS
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800">
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-900">{log.ipAddress}</td>
                    <td className="px-6 py-4 text-zinc-800">{log.device} ({log.browser})</td>
                    <td className="px-6 py-4 text-zinc-600">{log.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm space-y-6 max-w-2xl">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="font-display text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" /> Privacy & Data Consent
            </h3>
            <p className="text-xs text-zinc-500">Control profile visibility and AI data analysis consents.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-zinc-100">
              <div>
                <h4 className="font-bold text-zinc-900">AI Predictive Data Processing Consent</h4>
                <p className="text-zinc-500">Allow AI models to analyze team telemetry for velocity prediction.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateSecurityStatus({
                    privacy: {
                      ...securityStatus.privacy,
                      aiDataUsageConsent: !securityStatus.privacy.aiDataUsageConsent,
                    },
                  })
                }
                className={`w-12 h-6 rounded-full transition-all relative ${
                  securityStatus.privacy.aiDataUsageConsent ? 'bg-emerald-500' : 'bg-zinc-300'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-md ${
                    securityStatus.privacy.aiDataUsageConsent ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      <AnimatePresence>
        {is2FAModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-zinc-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-zinc-900">Setup Two-Factor Auth</h2>
                  <p className="text-xs text-zinc-500">Scan QR code with Google Authenticator or Authy.</p>
                </div>
                <button
                  onClick={() => setIs2FAModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 py-2">
                <div className="w-48 h-48 bg-zinc-900 rounded-2xl flex items-center justify-center p-4 shadow-inner">
                  <QrCode className="w-36 h-36 text-emerald-400" />
                </div>
                <p className="text-[11px] font-mono text-zinc-500 text-center">
                  Secret Key: <span className="font-bold text-zinc-900">JBSWY3DPEHPK3PXP</span>
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-zinc-700">6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest font-mono text-lg py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 text-xs">
                <button
                  type="button"
                  onClick={() => setIs2FAModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateSecurityStatus({ twoFactorEnabled: true });
                    setIs2FAModalOpen(false);
                    setToastMessage('2FA enabled successfully!');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md"
                >
                  Verify & Activate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
