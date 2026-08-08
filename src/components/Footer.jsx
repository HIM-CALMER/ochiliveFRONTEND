function Footer() {
  return (
    <footer className="mx-3 mb-3 rounded-[24px] border border-white/10 bg-slate-950/80 px-4 py-5 text-sm text-slate-400 shadow-[0_20px_60px_-30px_rgba(2,6,23,0.9)] backdrop-blur-xl sm:mx-6 sm:px-6 lg:mx-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-300">Ochi Live</p>
          <p className="mt-1 text-slate-300">A polished stage for live comedy and creator-led experiences.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <a href="#" className="transition hover:text-white">
            Privacy
          </a>
          <a href="#" className="transition hover:text-white">
            Terms
          </a>
          <a href="#" className="transition hover:text-white">
            Help
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

