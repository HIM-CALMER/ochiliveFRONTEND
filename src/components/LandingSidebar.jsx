import { Link } from 'react-router-dom';

function LandingSidebar() {
  return (
    <aside className="hidden lg:flex lg:min-h-screen lg:w-72 lg:flex-col lg:justify-between lg:border-r lg:border-white/10 lg:bg-[var(--ochi-surface)] lg:px-6 lg:py-8">
      <div>
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Ochi Live</p>
          <div className="mt-3 text-2xl font-bold tracking-tight text-white">Premium comedy</div>
        </div>

        <nav className="space-y-3 text-sm text-slate-300">
          <Link className="flex items-center gap-3 rounded-md bg-[rgba(255,255,255,0.08)] px-4 py-3 text-white transition hover:bg-white/10" to="/">
            <span>ðŸ </span>
            Home
          </Link>
          <Link className="flex items-center gap-3 rounded-md px-4 py-3 transition hover:bg-white/10 hover:text-white" to="/signup">
            <span>ðŸ”</span>
            Discover
          </Link>
          <Link className="flex items-center gap-3 rounded-md px-4 py-3 transition hover:bg-white/10 hover:text-white" to="/login">
            <span>âš¡</span>
            Activity
          </Link>
          <Link className="flex items-center gap-3 rounded-md px-4 py-3 transition hover:bg-white/10 hover:text-white" to="/home">
            <span>ðŸ””</span>
            Notifications
          </Link>
          <Link className="flex items-center gap-3 rounded-md px-4 py-3 transition hover:bg-white/10 hover:text-white" to="/home">
            <span>ðŸ‘¤</span>
            Profile
          </Link>
        </nav>
      </div>

      <div>
        <button className="w-full rounded-md bg-[var(--ochi-accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(244,63,94,0.24)] transition hover:bg-pink-500">
          Shows Tonight
        </button>
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
          Live now
        </div>
      </div>
    </aside>
  );
}

export default LandingSidebar;


