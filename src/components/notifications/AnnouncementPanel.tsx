import React, { useState } from 'react';
import {
  Megaphone,
  Pin,
  Plus,
  Send,
  X,
  Sparkles,
  Calendar,
  Users,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AnnouncementPanel() {
  const { announcements, addAnnouncement, currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'broadcast'>('broadcast');
  const [pinned, setPinned] = useState(true);
  const [audience, setAudience] = useState('All Workspace Members');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addAnnouncement({
      title,
      content,
      author: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      priority,
      pinned,
      targetAudience: audience,
      tags: ['Broadcast', priority.toUpperCase()],
    });

    setTitle('');
    setContent('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-zinc-900">Workspace Broadcast Announcements</h2>
          <p className="text-zinc-500">Official team announcements, code freeze notifications, and release notes</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-brand-green" /> Post Broadcast
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-6 rounded-3xl border transition-all space-y-3 relative ${
              ann.pinned
                ? 'bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border-zinc-800 shadow-xl'
                : 'bg-white text-zinc-900 border-zinc-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ann.priority === 'broadcast'
                      ? 'bg-brand-green/20 text-brand-green'
                      : ann.priority === 'urgent'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-zinc-700/40 text-zinc-300'
                  }`}
                >
                  {ann.priority}
                </span>
                <span className="text-[11px] opacity-70 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {ann.targetAudience}
                </span>
              </div>

              {ann.pinned && (
                <div className="flex items-center gap-1 text-brand-green font-bold text-[10px]">
                  <Pin className="w-3.5 h-3.5 fill-current" /> Pinned Broadcast
                </div>
              )}
            </div>

            <h3 className="font-display text-lg font-bold">{ann.title}</h3>
            <p className="text-xs leading-relaxed opacity-90">{ann.content}</p>

            <div className="pt-3 border-t border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <img src={ann.authorAvatar} alt={ann.author} className="w-5 h-5 rounded-full object-cover" />
                <span className="font-bold">{ann.author}</span>
                <span className="opacity-60">({ann.authorRole})</span>
              </div>

              <span className="opacity-60 font-mono">{ann.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for creating announcements */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-zinc-200 shadow-2xl relative space-y-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-brand-green flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-zinc-900">Create Broadcast Announcement</h2>
                <p className="text-xs text-zinc-500">Notify all team members across in-app feed & email</p>
              </div>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 block">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🚀 Sprint 24 Staging Freeze at 4 PM"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3.5 py-2.5 font-semibold text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 block">Content Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed information regarding release freeze, staging server status..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3.5 py-2.5 text-zinc-800 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 block">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent' | 'broadcast')}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 font-medium text-zinc-900"
                  >
                    <option value="broadcast">Critical Broadcast</option>
                    <option value="urgent">Urgent</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 block">Target Audience</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 font-medium text-zinc-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="accent-zinc-900 w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="pinCheck" className="font-semibold text-zinc-800 cursor-pointer">
                  Pin to top of team notification feeds
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-100 text-zinc-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-brand-green" /> Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
