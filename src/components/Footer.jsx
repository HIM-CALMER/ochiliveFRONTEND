function Footer() {
  return (
    <footer className="rounded-[2rem] border border-white/10 bg-slate-950/95 px-6 py-6 text-sm text-slate-400 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-200">OCHI LIVE</p>
        <div className="flex flex-wrap items-center gap-4">
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

