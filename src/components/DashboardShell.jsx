import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import screenLogo from '../assets/animations/screen.png';

const navItems = [
  { label: 'Home', path: '/home', icon: 'home' },
  { label: 'Discover', path: '/discover', icon: 'search' },
  { label: 'Activity', path: '/activity', icon: 'activity' },
  { label: 'Messages', path: '/messages', icon: 'message' },
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
          <path d="M12 3v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="m8 7 4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'plus':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
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
    case 'message':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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

export default function DashboardShell({
  title,
  subtitle,
  children,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  onSearchKeyDown,
  searchInputRef,
  showSearch = true,
  showBack = false,
  backFallback = '/home',
  searchPlaceholder = 'Search creators by name or username',
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/' || location.pathname === '/home';
  const isProfileRoute = location.pathname === '/profile' || location.pathname.startsWith('/profile/');
  const isSettingsRoute = location.pathname === '/settings';
  const isProfileToolbarRoute = isProfileRoute || isSettingsRoute;

  const handleKeyDown = (event) => {
    if (typeof onSearchKeyDown === 'function') {
      onSearchKeyDown(event);
      return;
    }

    if (event.key === 'Enter' && typeof onSearchSubmit === 'function') {
      event.preventDefault();
      onSearchSubmit(event);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-x-0 top-0 z-40 bg-slate-950/95 backdrop-blur-xl">
        {isHome ? (
          <div className="mx-auto max-w-6xl px-2 py-2 sm:px-6">
            <div className="rounded-full bg-slate-900/70 px-2 py-1.5 shadow-sm backdrop-blur-sm sm:px-3 sm:py-2">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link to="/notifications" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-slate-200 transition hover:bg-slate-800 sm:h-9 sm:w-9" aria-label="Notifications">
                    <Icon name="bell" className="h-4 w-4" />
                  </Link>
                </div>

                <div className="flex flex-1 justify-end">
                  <Link
                    to="/discover?focus=search"
                    className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 text-slate-400 shadow-sm transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-400/40 sm:h-10 sm:w-10"
                    aria-label="Search creators and content"
                    title="Search"
                  >
                    <Icon name="search" className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-x-0 top-0 z-40 border-b border-slate-900/70 bg-slate-950/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
              {showBack ? (
                <button
                  type="button"
                  onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(backFallback))}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-300/30"
                  aria-label="Go back"
                  title="Go back"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                    <path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : <span />}
              {isProfileToolbarRoute ? (
                <div className="flex w-full items-center justify-end gap-3">
                  <Link
                    to="/upload"
                    className="group inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-300/60 bg-gradient-to-br from-rose-500 to-amber-500 px-3 text-white shadow-[0_8px_22px_-8px_rgba(244,63,94,0.85)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(244,63,94,0.95)] focus:outline-none focus:ring-2 focus:ring-rose-300/50"
                    aria-label="Upload content"
                    title="Upload content"
                  >
                    <Icon name="plus" className="h-6 w-6 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-semibold">Upload</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 text-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-sky-300/50 hover:bg-slate-800 hover:text-sky-200 hover:shadow-[0_16px_35px_rgba(15,23,42,0.45)] focus:outline-none focus:ring-2 focus:ring-sky-300/30"
                    aria-label="Profile settings"
                  >
                    <Icon name="settings" className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  </Link>
                </div>
              ) : showSearch ? (
                <div className="flex w-full items-center justify-end">
                  <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.32)]">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-slate-500" aria-hidden="true">
                      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
                      <path d="m16 16 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchValue}
                      onChange={(event) => onSearchChange?.(event.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={searchPlaceholder}
                      className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <main className="mx-auto max-w-6xl px-3 pb-24 pt-20 sm:px-6 sm:pb-28 sm:pt-24">
        <div className="space-y-4 sm:space-y-6">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-slate-950/98 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-5 items-stretch px-1 py-1.5 sm:flex sm:items-center sm:justify-center sm:gap-6 sm:px-6 sm:py-1.5">
          {navItems.map((item) => {
            const colorMap = {
              home: 'text-amber-400',
              search: 'text-rose-300',
              upload: 'text-amber-400',
              message: 'text-violet-300',
              user: 'text-sky-300',
              activity: 'text-slate-400',
            };

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 text-[10px] font-medium transition-colors sm:min-h-0 sm:flex-row sm:gap-1 sm:px-3 sm:py-2 sm:text-sm ${
                    isActive ? 'font-semibold text-white' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`inline-flex h-7 w-7 items-center justify-center ${isActive ? 'text-white' : colorMap[item.icon]}`}>
                      <Icon name={item.icon} className="h-5 w-5 transition-transform group-active:scale-90" />
                    </span>
                    <span className="truncate leading-4">{item.label}</span>
                    <span className={`absolute bottom-0 h-0.5 rounded-full bg-rose-300 transition-all duration-200 sm:hidden ${isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'}`} />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
