import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Maximize2,
  Folder,
  ShoppingBag,
  PieChart,
  Users,
  FileText,
  Wrench,
  Settings,
  Bell,
  Plus,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  ExternalLink,
  Check,
  LogOut,
  FolderPlus,
  Scan,
} from 'lucide-react';
import { archMindStore } from '../../services/store';
import { AppRoute, Project, NotificationItem } from '../../types';
import { ArchMindCopilot } from '../copilot/ArchMindCopilot';
import { GlobalSearchModal } from './GlobalSearchModal';
import { CreateProjectModal } from './CreateProjectModal';

interface AppShellProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  onSignOut,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Subscribe to store updates
  const [, setTick] = useState(0);
  useEffect(() => {
    return archMindStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const user = archMindStore.getUser();
  const activeProject = archMindStore.getActiveProject();
  const projects = archMindStore.getProjects();
  const notifications = archMindStore.getNotifications();
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navItems = [
    { label: 'Overview', route: '/app/overview', icon: LayoutDashboard },
    { label: 'Discover Properties', route: '/app/properties', icon: Search },
    { label: 'AI Design Studio', route: '/app/design-studio', icon: Sparkles },
    { label: 'Space Analysis', route: '/app/space-analysis', icon: Scan },
    { label: 'Floor Plans', route: '/app/floor-plans', icon: Maximize2 },
    { label: 'Projects', route: '/app/projects', icon: Folder },
    { label: 'Products & Materials', route: '/app/products', icon: ShoppingBag },
    { label: 'Budget Planner', route: '/app/budget', icon: PieChart },
    { label: 'Professionals', route: '/app/professionals', icon: Users },
    { label: 'Documents', route: '/app/documents', icon: FileText },
    { label: 'Maintenance', route: '/app/maintenance', icon: Wrench },
    { label: 'Settings', route: '/app/settings', icon: Settings },
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const handleSwitchProject = (projectId: string) => {
    archMindStore.setActiveProjectId(projectId);
    setProjectDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171C2C] flex">
      
      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#E6E9ED] flex-col justify-between p-5 sticky top-0 h-screen z-30 flex-shrink-0">
        <div>
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => handleNavClick('/')}
            className="cursor-pointer mb-7 group flex flex-col"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#006B7B] flex items-center justify-center text-white shadow-xs">
                {/* Architectural Gable Roof Minimal Icon */}
                <svg className="w-5 h-5 fill-none stroke-white stroke-[2.2]" viewBox="0 0 24 24">
                  <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
                  <path d="M9 21V12h6v9" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#171C2C]">ArchMind</span>
            </div>
            <p className="text-[11px] text-[#667085] mt-1.5 leading-tight tracking-tight">
              From Dream to Home —<br />Powered by AI.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentRoute === item.route ||
                (item.route !== '/app/overview' && currentRoute.startsWith(item.route));

              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#E4F3F4] text-[#006B7B] font-semibold shadow-xs'
                      : 'text-[#667085] hover:text-[#171C2C] hover:bg-gray-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#006B7B]' : 'text-[#667085]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Architectural Inspiration Card */}
        <div className="mt-6 pt-4 border-t border-[#E6E9ED]">
          <div className="p-3.5 bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-2xl border border-amber-200/50 relative overflow-hidden group">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&q=80"
                alt="Architecture"
                className="w-12 h-12 rounded-xl object-cover shadow-xs flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-gray-900 leading-snug">
                  Design better living, with AI.
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">Smarter spaces. Happier lives.</div>
              </div>
              <button
                onClick={() => handleNavClick('/app/design-studio')}
                className="w-7 h-7 rounded-full bg-white shadow-xs border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-[#006B7B] hover:text-white transition-colors flex-shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE DRAWER */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full p-5 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#006B7B] flex items-center justify-center text-white">
                    <svg className="w-5 h-5 fill-none stroke-white stroke-[2.2]" viewBox="0 0 24 24">
                      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
                      <path d="M9 21V12h6v9" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900">ArchMind</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.route;
                  return (
                    <button
                      key={item.route}
                      onClick={() => handleNavClick(item.route)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                        isActive
                          ? 'bg-[#E4F3F4] text-[#006B7B] font-semibold'
                          : 'text-[#667085] hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut?.();
                }}
                className="w-full flex items-center gap-2 text-xs text-rose-600 px-3 py-2 hover:bg-rose-50 rounded-xl font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN CONTENT WRAPPER */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVIGATION BAR */}
        <header className="h-16 bg-white border-b border-[#E6E9ED] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          
          {/* Left: Mobile hamburger + Global Search */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div
              onClick={() => setSearchModalOpen(true)}
              className="w-full max-w-md flex items-center gap-2 px-3.5 py-2 bg-[#FAFAF8] hover:bg-gray-100/80 border border-[#E6E9ED] rounded-xl cursor-pointer text-xs text-gray-400 transition-colors group"
            >
              <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
              <span className="flex-1 truncate">Search properties, designs, products, professionals...</span>
              <kbd className="hidden sm:inline-block text-[10px] bg-white text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 font-mono shadow-2xs">
                ⌘ K
              </kbd>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E6E9ED] p-3 text-xs z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-800">Notifications</span>
                    <button
                      onClick={() => archMindStore.markAllNotificationsRead()}
                      className="text-[11px] text-[#006B7B] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          archMindStore.markNotificationRead(n.id);
                          if (n.linkRoute) onNavigate(n.linkRoute);
                          setNotifDropdownOpen(false);
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                          n.read ? 'hover:bg-gray-50 text-gray-600' : 'bg-[#E4F3F4]/50 text-gray-900 font-medium'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[11px] font-semibold">{n.title}</span>
                          <span className="text-[10px] text-gray-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Project Selector Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 text-left"
              >
                <img
                  src={activeProject?.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80'}
                  alt={activeProject?.name || 'Project'}
                  className="w-7 h-7 rounded-lg object-cover shadow-2xs"
                />
                <div className="max-w-[140px] truncate leading-tight">
                  <div className="text-xs font-semibold text-gray-900 truncate">{activeProject?.name || 'Project'}</div>
                  <div className="text-[10px] text-gray-500 truncate">{activeProject?.location || 'Malaysia'}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              </button>

              {/* Project Switcher Menu */}
              {projectDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E6E9ED] p-2 text-xs z-50 animate-in fade-in duration-150">
                  <div className="text-[11px] font-semibold text-gray-400 px-3 py-1 uppercase tracking-wider">
                    Switch Active Project
                  </div>
                  <div className="space-y-1 my-1">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSwitchProject(p.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                          p.id === activeProject?.id
                            ? 'bg-[#E4F3F4] text-[#006B7B] font-semibold'
                            : 'hover:bg-gray-50 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={p.coverImage} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                          <div className="truncate">
                            <div className="truncate text-xs">{p.name}</div>
                            <div className="text-[10px] text-gray-500 truncate">{p.location}</div>
                          </div>
                        </div>
                        {p.id === activeProject?.id && <Check className="w-4 h-4 text-[#006B7B]" />}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setProjectDropdownOpen(false);
                        setCreateProjectOpen(true);
                      }}
                      className="w-full flex items-center gap-2 p-2 text-[#006B7B] hover:bg-[#E4F3F4] rounded-xl font-medium transition-colors"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>Create New Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-600/20"
                />
                <div className="hidden sm:block text-left leading-tight pr-1">
                  <div className="text-xs font-semibold text-gray-900">{user.name}</div>
                  <div className="text-[10px] text-gray-500">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E6E9ED] p-2 text-xs z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('/app/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-xl text-gray-700 font-medium"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      archMindStore.resetToDemo();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-xl text-gray-700 font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Reset Demo Project Data</span>
                  </button>
                  <div className="pt-1 mt-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSignOut?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* "+ New Project" Primary CTA Button */}
            <button
              onClick={() => setCreateProjectOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </button>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

      {/* Persistent AI Copilot Assistant */}
      <ArchMindCopilot onNavigate={onNavigate} />

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Create Project Dialog */}
      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onCreated={(id) => onNavigate(`/app/projects/${id}`)}
      />

    </div>
  );
};
