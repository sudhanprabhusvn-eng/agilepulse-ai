import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { loginApi, registerApi } from '../../services/authService';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRoleState] = useState<UserRole>('Scrum Master');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { setRole, addAuditLog, setActiveTab } = useApp();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const res = await loginApi(email || 'sarah.j@agilepulse.ai', password || 'Password123!');
        if (res.success) {
          setSuccessMsg('Successfully authenticated!');
          setRole(role);
          addAuditLog('User Login', `User ${email || 'sarah.j@agilepulse.ai'} logged in successfully.`);
          setTimeout(() => {
            onClose();
            setActiveTab('dashboard');
          }, 600);
        } else {
          setErrorMsg(res.message || 'Login failed.');
        }
      } else if (mode === 'register') {
        const res = await registerApi({
          firstName: firstName || 'Agile',
          lastName: lastName || 'Engineer',
          email: email || 'user@agilepulse.ai',
          password: password || 'Password123!',
          role,
        });
        if (res.success) {
          setSuccessMsg('Account registered successfully! Redirecting...');
          setRole(role);
          addAuditLog('User Registered', `New user registered with role ${role}`);
          setTimeout(() => {
            onClose();
            setActiveTab('dashboard');
          }, 800);
        } else {
          setErrorMsg(res.message || 'Registration failed.');
        }
      } else if (mode === 'forgot') {
        setSuccessMsg('Password reset instructions sent to your email.');
        setTimeout(() => {
          setMode('login');
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-zinc-200 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 text-black text-xs font-mono font-bold uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-green" /> AgilePulse AI Auth
            </div>
            <h2 className="font-display text-2xl font-bold text-zinc-900 tracking-tight">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {mode === 'login' && 'Sign in to access real-time sprint health & risk prediction.'}
              {mode === 'register' && 'Start predicting sprint delays and risk factors instantly.'}
              {mode === 'forgot' && 'Enter your registered email to receive a password reset link.'}
            </p>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Sarah"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.j@agilepulse.ai"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-zinc-700 font-semibold">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-brand-green hover:underline text-[11px] font-semibold"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Agile Role</label>
                <select
                  value={role}
                  onChange={(e) => setRoleState(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium focus:outline-none focus:border-brand-green"
                >
                  <option value="Scrum Master">Scrum Master</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Engineering Manager">Engineering Manager</option>
                  <option value="Product Owner">Product Owner</option>
                  <option value="Developer">Developer</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Register Account'}
                    {mode === 'forgot' && 'Send Reset Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer toggle */}
          <div className="mt-6 pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500">
            {mode === 'login' && (
              <p>
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-zinc-900 font-bold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            )}
            {mode === 'register' && (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-zinc-900 font-bold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-zinc-900 font-bold hover:underline cursor-pointer"
                >
                  Back to login
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
