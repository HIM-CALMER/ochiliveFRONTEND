import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-[var(--ochi-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.32em] text-rose-200">
            OL
          </span>
          <span className="hidden sm:block">Ochi Live</span>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <Link className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-4" to="/login">
            Sign in
          </Link>
          <Link className="rounded-full bg-[var(--ochi-accent)] px-3 py-2 font-medium text-[var(--ochi-bg)] shadow-[0_10px_30px_-12px_rgba(244,63,94,0.6)] transition hover:bg-rose-400 sm:px-4" to="/signup">
            Create
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
