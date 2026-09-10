import React from 'react';
import { Briefcase, UploadCloud, Users, Calendar, ShieldCheck, UserCheck, ChevronRight, Sparkles } from 'lucide-react';
import { useAppAuth, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from './AuthProvider';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { role, setRole, activeCandidateName } = useAppAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'upload-cv', label: 'Upload CV', highlight: true },
    { id: 'candidate-portal', label: 'Candidate Portal' },
    { id: 'interviews', label: 'Interviews' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'hr-dashboard', label: 'HR Dashboard', badge: 'HR' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      {/* Top Banner with Role Switcher */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Recruitment Engine
            </span>
            <span className="hidden sm:inline text-slate-400">
              Active Candidate: <strong className="text-slate-200">{activeCandidateName || 'Ahmad Khan'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden sm:inline">Role View:</span>
            <div className="inline-flex rounded-md bg-slate-900 p-0.5 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setRole('candidate');
                  setCurrentTab('candidate-portal');
                }}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition ${
                  role === 'candidate'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Candidate View
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('hr');
                  setCurrentTab('hr-dashboard');
                }}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition ${
                  role === 'hr'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                HR Lead View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">Talent</span>
                <span className="font-bold text-lg text-blue-400 tracking-tight">Filter</span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase block -mt-1 font-semibold">
                HR Recruitment Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all active:scale-95"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition relative ${
                    isActive
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Auth Controls */}
          <div className="flex items-center gap-3">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            {/* Mobile Nav Toggle / Quick Action */}
            <button
              onClick={() => setCurrentTab('upload-cv')}
              className="lg:hidden inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload CV
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Nav */}
        <div className="lg:hidden flex items-center space-x-2 py-2 overflow-x-auto border-t border-slate-800 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium ${
                currentTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
