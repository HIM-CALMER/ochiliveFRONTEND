import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="hidden items-center justify-between border-b border-white/10 bg-[var(--ochi-surface)] px-6 py-4 text-sm text-slate-300 shadow-[0_1px_0_rgba(255,255,255,0.03)] lg:flex">
      <div className="flex items-center gap-4 text-white/90">Ochi Live</div>
      <div className="flex items-center gap-4">
        <Link className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white" to="/">Home</Link>
        <Link className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white" to="/signup">Sign Up</Link>
        <Link className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white" to="/login">Log In</Link>
      </div>
    </nav>
  );
}

export default Navbar;
