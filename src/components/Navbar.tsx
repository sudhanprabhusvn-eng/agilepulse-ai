import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, LayoutDashboard, Kanban, Cpu, BarChart3, FileText, Bell, Sparkles, Shield, User as UserIcon, LogIn, Bot, Search, Users, Link2, Smartphone } from 'lucide-react';
import { useApp, ActiveTab } from '../context/AppContext';
import { UserRole } from '../types';
import { AuthModal } from './auth/AuthModal';
import { NotificationDrawer } from './notifications/NotificationDrawer';

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const { activeTab, setActiveTab, currentUser, setRole, notifications, setIsAiDrawerOpen } = useApp();

  const unreadCount = notifications.filter((n) => !n.read && !n.archived).length;

  const roles: UserRole[] = ['Scrum Master', 'Project Manager', 'Engineering Manager', 'Product Owner', 'Developer', 'Executive'];


  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const landingNavLinks = [
    { name: 'Features', tab: 'landing' as ActiveTab, hash: '#features' },
    { name: 'Sprint Analytics', tab: 'analytics' as ActiveTab },
    { name: 'Risk Prediction', tab: 'landing' as ActiveTab, hash: '#risk-prediction' },
    { name: 'About', tab: 'landing' as ActiveTab, hash: '#about' },
  ];

  const appPrimaryLinks = [
    { name: 'Dashboard', tab: 'dashboard' as ActiveTab, icon: LayoutDashboard },
    { name: 'Sprint Board', tab: 'board' as ActiveTab, icon: Kanban },
    { name: 'Analytics', tab: 'analytics' as ActiveTab, icon: BarChart3 },
    { name: 'Simulator', tab: 'simulator' as ActiveTab, icon: Cpu },
    { name: 'Collaboration', tab: 'collaboration' as ActiveTab, icon: Users },
    { name: 'Reports', tab: 'reports' as ActiveTab, icon: FileText },
  ];

  const appMoreLinks = [
    { name: 'AI Agents & Prompts', tab: 'ai-agents' as ActiveTab, icon: Bot },
    { name: 'Search & Knowledge', tab: 'search' as ActiveTab, icon: Search },
    { name: 'Integrations & Plugins', tab: 'integrations' as ActiveTab, icon: Link2 },
    { name: 'Offline & PWA', tab: 'pwa-offline' as ActiveTab, icon: Smartphone },
    { name: 'Notifications Hub', tab: 'notifications' as ActiveTab, icon: Bell },
  ];

  const isMoreTabActive = appMoreLinks.some((l) => l.tab === activeTab);

  const handleNavClick = (tab: ActiveTab, hash?: string) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
    setIsMoreMenuOpen(false);
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 py-3 md:py-4 bg-gradient-to-b from-[#f1f1f1]/95 via-[#f1f1f1]/85 to-transparent backdrop-blur-md transition-all">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-3 lg:gap-6">
            {/* Left: Logo & Brand Name */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleNavClick('landing')}
                className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-brand-green shadow-md transition-transform group-hover:scale-105">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-lg md:text-xl font-bold tracking-tight text-zinc-900 whitespace-nowrap">
                    AgilePulse AI
                  </span>
                  {activeTab !== 'landing' && (
                    <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-green text-black font-semibold">
                      SAAS
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Center Navigation Container (Pill Design) */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-white/80 backdrop-blur border border-zinc-200/80 p-1 lg:p-1.5 rounded-full shadow-sm shrink-0">
              {activeTab === 'landing' ? (
                landingNavLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.tab, link.hash)}
                    className="px-2.5 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100/80 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {link.name}
                  </button>
                ))
              ) : (
                <>
                  {appPrimaryLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = activeTab === link.tab;
                    return (
                      <button
                        key={link.name}
                        onClick={() => handleNavClick(link.tab)}
                        className={`flex items-center gap-1 lg:gap-1.5 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{link.name}</span>
                      </button>
                    );
                  })}

                  {/* More Modules Dropdown Pill */}
                  <div className="relative group">
                    <button
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className={`flex items-center gap-1 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                        isMoreTabActive
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
                      }`}
                    >
                      <span>More</span>
                      <span className="text-[10px] opacity-70">▾</span>
                    </button>

                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 text-xs font-semibold text-zinc-700 space-y-1">
                      {appMoreLinks.map((item) => {
                        const Icon = item.icon;
                        const isSelected = activeTab === item.tab;
                        return (
                          <button
                            key={item.tab}
                            onClick={() => handleNavClick(item.tab)}
                            className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                              isSelected ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100 text-zinc-700'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
              {activeTab === 'landing' ? (
                <>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="text-zinc-700 hover:text-zinc-900 font-semibold transition-colors duration-200 cursor-pointer px-3 py-1.5 flex items-center gap-1.5 text-xs lg:text-sm whitespace-nowrap"
                  >
                    <LogIn className="w-4 h-4 text-zinc-500" /> Sign In
                  </button>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 lg:px-5 py-2 text-xs lg:text-sm font-medium hover:bg-zinc-800 transition-all duration-200 shadow-sm cursor-pointer hover:shadow-md whitespace-nowrap"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 lg:gap-2.5">
                  {/* Subtle Separator Divider */}
                  <div className="h-4 w-px bg-zinc-300/70 hidden lg:block" />

                  {/* AI Copilot Drawer Trigger */}
                  <button
                    onClick={() => setIsAiDrawerOpen(true)}
                    className="py-1.5 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 shadow-sm flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                    title="Ask AgilePulse AI Copilot"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                    <span>AI Copilot</span>
                  </button>

                  {/* Notification Bell */}
                  <button
                    onClick={() => setIsNotificationDrawerOpen(true)}
                    className="relative p-2 rounded-full bg-white/90 hover:bg-white text-zinc-700 border border-zinc-200/80 shadow-sm transition-all cursor-pointer"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Role Switcher Selector */}
                  <div className="relative">
                    <select
                      value={currentUser.role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="bg-white/90 border border-zinc-200/80 text-zinc-800 text-xs font-semibold rounded-full px-3 py-1.5 focus:outline-none focus:border-brand-green cursor-pointer shadow-sm hover:border-zinc-300"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          🎭 {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Enterprise Profile & Admin Quick Menu */}
                  <div className="relative group">
                    <button
                      onClick={() => handleNavClick('profile')}
                      className="flex items-center gap-2 p-1 rounded-full bg-white border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all cursor-pointer"
                      title="User Profile & Enterprise Menu"
                    >
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover bg-zinc-900"
                      />
                    </button>

                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-zinc-200/80 p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 text-xs font-semibold text-zinc-700 space-y-1">
                      <div className="px-3 py-2 border-b border-zinc-100">
                        <div className="font-bold text-zinc-900 truncate">{currentUser.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono truncate">{currentUser.email}</div>
                      </div>

                      <button
                        onClick={() => handleNavClick('profile')}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                          activeTab === 'profile' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'
                        }`}
                      >
                        <span>User Profile</span>
                        <UserIcon className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleNavClick('workspace')}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                          activeTab === 'workspace' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'
                        }`}
                      >
                        <span>Workspace Management</span>
                        <Kanban className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleNavClick('organization')}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                          activeTab === 'organization' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'
                        }`}
                      >
                        <span>Organization Directory</span>
                        <LayoutDashboard className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleNavClick('settings')}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                          activeTab === 'settings' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'
                        }`}
                      >
                        <span>Settings & Personalization</span>
                        <Cpu className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleNavClick('security')}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                          activeTab === 'security' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'
                        }`}
                      >
                        <span>Security & Sessions</span>
                        <Shield className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleNavClick('admin')}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                          activeTab === 'admin' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'
                        }`}
                      >
                        <span>Super Admin Console</span>
                        <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                      </button>
                    </div>
                  </div>

                  {/* Return to Landing */}
                  <button
                    onClick={() => handleNavClick('landing')}
                    className="p-1.5 rounded-full hover:bg-white/80 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                    title="Landing Page"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex justify-end items-center gap-2 shrink-0">
              {activeTab !== 'landing' && (
                <button
                  onClick={() => setIsNotificationDrawerOpen(true)}
                  className="relative p-2 rounded-full bg-white text-zinc-700 border border-zinc-200"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 text-zinc-800 hover:text-black focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-zinc-200/80 mt-4"
            >
              <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 text-base font-medium text-zinc-700">
                {activeTab === 'landing' ? (
                  <>
                    {landingNavLinks.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => handleNavClick(link.tab, link.hash)}
                        className="text-left hover:text-zinc-900 py-1 transition-colors cursor-pointer"
                      >
                        {link.name}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setIsMobileOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="text-left hover:text-zinc-900 py-1 transition-colors cursor-pointer font-bold"
                    >
                      Sign In / Register
                    </button>
                    <button
                      onClick={() => handleNavClick('docs')}
                      className="text-left hover:text-zinc-900 py-1 transition-colors cursor-pointer"
                    >
                      Documentation
                    </button>
                    <div className="pt-2">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-black text-white px-5 py-3 text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        Get Started <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {[...appPrimaryLinks, ...appMoreLinks].map((link) => (
                      <button
                        key={link.name}
                        onClick={() => handleNavClick(link.tab)}
                        className="text-left flex items-center gap-2.5 hover:text-zinc-900 py-1.5 transition-colors cursor-pointer text-sm font-semibold"
                      >
                        <link.icon className="w-4 h-4 shrink-0 text-zinc-500" />
                        <span>{link.name}</span>
                      </button>
                    ))}
                    <div className="pt-2 border-t border-zinc-200">
                      <label className="text-xs text-zinc-500 block mb-1">Switch Role:</label>
                      <select
                        value={currentUser.role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full bg-zinc-100 border border-zinc-300 text-zinc-800 text-sm rounded-lg p-2 font-medium"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            🎭 {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Slide-over Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </>
  );
}

