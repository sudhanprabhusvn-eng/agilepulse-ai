import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Users,
  MapPin,
  Globe,
  Calendar,
  Clock,
  CheckCircle2,
  Edit3,
  Camera,
  Shield,
  Eye,
  Award,
  Sparkles,
  Save,
  X,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';

export function ProfileView() {
  const { userProfile, updateUserProfile, setToastMessage } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewPublic, setIsPreviewPublic] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(userProfile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(editForm);
    setIsEditModalOpen(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditForm((prev) => ({ ...prev, avatar: url }));
      setToastMessage('New avatar uploaded! Save changes to apply.');
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditForm((prev) => ({ ...prev, coverImage: url }));
      setToastMessage('New cover banner uploaded! Save changes to apply.');
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Profile Header Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/90 shadow-lg">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-zinc-800 to-zinc-900">
          <img
            src={userProfile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Action buttons on banner */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              onClick={() => setIsPreviewPublic(!isPreviewPublic)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 ${
                isPreviewPublic
                  ? 'bg-brand-green text-black font-bold'
                  : 'bg-black/50 text-white border border-white/20 hover:bg-black/70'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {isPreviewPublic ? 'Preview Mode (Public)' : 'View as Public'}
            </button>
            <button
              onClick={() => {
                setEditForm(userProfile);
                setIsEditModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-white text-zinc-900 font-bold text-xs shadow-md hover:bg-zinc-100 transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* User Avatar & Info Row */}
        <div className="px-6 md:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 md:-mt-20 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
              <div className="relative group">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.fullName}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-3xl border-4 border-white shadow-2xl object-cover bg-zinc-900"
                />
                <span
                  className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                    userProfile.onlineStatus === 'online'
                      ? 'bg-emerald-500'
                      : userProfile.onlineStatus === 'busy'
                      ? 'bg-rose-500'
                      : userProfile.onlineStatus === 'away'
                      ? 'bg-amber-500'
                      : 'bg-zinc-400'
                  }`}
                  title={`Status: ${userProfile.onlineStatus}`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-zinc-900">
                    {userProfile.fullName}
                  </h1>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {userProfile.role}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
                    {userProfile.employeeId}
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-600 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-zinc-400" />
                  {userProfile.jobTitle} • {userProfile.department}
                </p>
                <p className="text-xs text-zinc-500 flex items-center gap-3 pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-zinc-400" /> {userProfile.organization}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-zinc-400" /> {userProfile.team}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {userProfile.timeZone}
                  </span>
                </p>
              </div>
            </div>

            {/* Completion Badge */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 w-full md:w-auto min-w-[220px]">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 mb-1.5">
                <span>Profile Completion</span>
                <span className="text-emerald-600">{userProfile.completionScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${userProfile.completionScore}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> All verified credentials connected
              </p>
            </div>
          </div>

          {/* Quick Metrics & Bio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-100">
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
                Professional Bio & Summary
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50/60 p-4 rounded-2xl border border-zinc-100">
                {userProfile.bio}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
                Key Profile Metadata
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </span>
                  <span className="font-semibold text-zinc-900">{userProfile.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </span>
                  <span className="font-semibold text-zinc-900">{userProfile.phoneNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Language
                  </span>
                  <span className="font-semibold text-zinc-900">{userProfile.language}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Joined Date
                  </span>
                  <span className="font-semibold text-zinc-900">{userProfile.joinedDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Last Login
                  </span>
                  <span className="font-semibold text-zinc-900">{userProfile.lastLogin}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-500" /> Core Competencies & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white font-medium text-xs shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Experience & Achievements
              </h3>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-semibold">Agile Experience</span>
                  <span className="font-bold text-zinc-900">{userProfile.experienceYears} Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-semibold">Sprint Completion Rate</span>
                  <span className="font-bold text-emerald-600">96.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-semibold">AI Risk Predictions Verified</span>
                  <span className="font-bold text-indigo-600">142 Cases</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-zinc-100 my-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-zinc-900">Edit User Profile</h2>
                  <p className="text-xs text-zinc-500">Update your personal, departmental, and avatar metadata.</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {/* Avatar & Cover Upload controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Profile Picture Avatar</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={editForm.avatar}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border"
                      />
                      <label className="cursor-pointer px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" /> Upload File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Cover Banner Image</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={editForm.coverImage}
                        alt="Preview Cover"
                        className="w-16 h-12 rounded-xl object-cover border"
                      />
                      <label className="cursor-pointer px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" /> Change Banner
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Full Name</label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Email Address</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Job Title</label>
                    <input
                      type="text"
                      value={editForm.jobTitle}
                      onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Department</label>
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Team</label>
                    <input
                      type="text"
                      value={editForm.team}
                      onChange={(e) => setEditForm({ ...editForm, team: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Time Zone</label>
                    <input
                      type="text"
                      value={editForm.timeZone}
                      onChange={(e) => setEditForm({ ...editForm, timeZone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Bio & Summary</label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
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
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save Profile Changes
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
