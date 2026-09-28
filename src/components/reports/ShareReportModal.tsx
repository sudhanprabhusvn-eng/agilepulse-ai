import React, { useState } from 'react';
import { X, Share2, Copy, Check, Mail, Lock, Clock, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
}

export function ShareReportModal({ isOpen, onClose, reportTitle }: ShareReportModalProps) {
  const { setToastMessage } = useApp();
  const [copied, setCopied] = useState(false);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState('AgilePulse#2026');
  const [expirationDays, setExpirationDays] = useState('7');
  const [recipientEmail, setRecipientEmail] = useState('');

  if (!isOpen) return null;

  const shareableUrl = `${window.location.origin}/reports/share/${Math.random().toString(36).substring(7)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setToastMessage('Shareable report link copied to clipboard.');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;
    setToastMessage(`Report "${reportTitle}" shared with ${recipientEmail}`);
    setRecipientEmail('');
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
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-900">Share Report Access</h2>
            <p className="text-xs text-zinc-500">{reportTitle}</p>
          </div>
        </div>

        {/* Share Link Copy Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700 block">Secure Shareable Link</label>
          <div className="flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="bg-transparent text-xs text-zinc-700 font-mono w-full px-2 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Security Preferences */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-zinc-700" />
              <span className="text-xs font-bold text-zinc-900">Password Protection</span>
            </div>
            <input
              type="checkbox"
              checked={passwordEnabled}
              onChange={(e) => setPasswordEnabled(e.target.checked)}
              className="accent-zinc-900 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {passwordEnabled && (
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access password"
              className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono text-zinc-900"
            />
          )}

          <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-700" />
              <span className="text-xs font-bold text-zinc-900">Link Expiration</span>
            </div>
            <select
              value={expirationDays}
              onChange={(e) => setExpirationDays(e.target.value)}
              className="bg-white border border-zinc-300 rounded-xl px-2.5 py-1.5 text-xs text-zinc-800 font-medium"
            >
              <option value="1">24 Hours</option>
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="never">Never Expire</option>
            </select>
          </div>
        </div>

        {/* Email Direct Send Form */}
        <form onSubmit={handleSendEmail} className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-zinc-700 block">Direct Email Invite</label>
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder="colleague@agilepulse.ai"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-3.5 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-brand-green text-black text-xs font-bold hover:bg-lime-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Send Invite
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted via TLS 1.3 with SOC2 Access Telemetry</span>
        </div>
      </div>
    </div>
  );
}
