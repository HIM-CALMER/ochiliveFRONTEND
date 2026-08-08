import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import screenLogo from '../assets/animations/screen.png';

const navItems = [
  { label: 'Home', path: '/home', icon: 'home' },
  { label: 'Discover', path: '/discover', icon: 'search' },
  { label: 'Upload', path: '/upload', icon: 'upload' },
  { label: 'Wallet', path: '/wallet', icon: 'wallet' },
  { label: 'Profile', path: '/profile', icon: 'user' },
];

function Icon({ name, className }) {
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M3 11.5L12 3l9 8.5V20a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1v-8.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'search':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="10" cy="10" r="6.25" stroke="currentColor" strokeWidth="2.2" />
          <path d="M15.4 15.4l3.2 3.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M14.5 10a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z" stroke="none" fill="currentColor" fillOpacity="0.04" />
        </svg>
      );
    case 'upload':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 4v9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10l4-4 4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="6" y="15" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.12" />
          <path d="M6 15h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="2.2" />
          <path d="M6 20c0-3.333 2.667-6 6-6s6 2.667 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'activity':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M3 12h4l3-8 4 16 3-8h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'wallet':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M5 7.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M6 11h3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M15 11h2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 3.73-1.5 6-3 6h18c-1.5 0-3-2.27-3-6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DashboardShell({ title, subtitle, children }) {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="sticky top-0 z-20 bg-slate-950/98 backdrop-blur-xl relative">
        {isHome ? (
          <div className="mx-auto max-w-6xl px-3 py-2 sm:px-6">
            <div className="rounded-2xl bg-slate-900/80 border border-white/6 px-4 py-3 shadow-sm backdrop-blur-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: logo + title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-950/90">
                    <img src={screenLogo} alt="Ochi Live logo" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 truncate">Ochi Live</p>
                    <h1 className="text-base sm:text-xl font-semibold text-white truncate">{title}</h1>
                    {subtitle ? <p className="hidden sm:block mt-1 text-sm text-slate-400 truncate max-w-2xl">{subtitle}</p> : null}
                  </div>
                </div>

                {/* Right: search (desktop), upload CTA, activity, notifications */}
                <div className="mt-2 sm:mt-0 flex items-center gap-3">
                  <div className="hidden sm:flex items-center rounded-full bg-slate-950/80 border border-white/6 px-3 py-2 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-slate-400" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" /><path d="m16.65 16.65 3.7 3.7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
                    <input type="search" placeholder="Search creators, categories" className="ml-3 w-60 bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-500" />
                  </div>

                  <Link to="/activity" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-amber-300 hover:bg-slate-800 transition" aria-label="Activity">
                    <Icon name="activity" className="h-5 w-5" />
                  </Link>

                  <Link to="/notifications" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-slate-200 hover:bg-slate-800 transition" aria-label="Notifications">
                    <Icon name="bell" className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-2xl bg-slate-950/90">
                <img src={screenLogo} alt="Ochi Live logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">{title}</h1>
                {subtitle ? <p className="hidden sm:block text-xs text-slate-400">{subtitle}</p> : null}
              </div>
            </div>
            <div>
              <Link to="/notifications" className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900 text-slate-200 transition hover:bg-slate-800 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-300/25" aria-label="Notifications">
                <Icon name="bell" className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6">
        <div className="space-y-6">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-slate-950/98 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-1 px-3 py-1.5 sm:px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex-1 min-w-0 flex-col items-center gap-1 px-1 py-1.5 sm:flex-row sm:px-3 sm:py-2 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`
              }
            >
              {item.icon === 'upload' ? (
                <span className="relative inline-flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 opacity-40 blur-sm animate-[pulse_1000ms_infinite]" />
                  <span className="relative inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-[0_24px_70px_-32px_rgba(245,158,11,0.45)] transform transition group-hover:scale-105 ring-3 ring-amber-500/30">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                </span>
              ) : (
                <Icon name={item.icon} className="h-5 w-5" />
              )}
              <span className="hidden sm:inline-block text-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
