import screenLogo from '../assets/animations/screen.png';

function BrandedLoader({ isVisible, label = 'Preparing your experience...' }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.94),rgba(2,6,23,0.98))] px-4 backdrop-blur-md">
      <div className="flex flex-col items-center rounded-[32px] border border-white/10 bg-slate-950/95 px-7 py-8 text-center shadow-[0_30px_100px_-20px_rgba(244,63,94,0.35)] sm:px-10 sm:py-10">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-rose-400/30 bg-slate-950/70 shadow-[0_0_45px_rgba(244,63,94,0.16)] sm:h-28 sm:w-28">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-rose-400 border-r-sky-400" />
          <div className="absolute inset-3 animate-pulse rounded-full border border-rose-400/20" />
          <img src={screenLogo} alt="Ochi Live logo" className="relative h-12 w-12 rounded-lg object-cover shadow-lg shadow-rose-500/20 sm:h-14 sm:w-14" />
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-rose-300">Ochi Live</p>
        <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{label}</h3>
        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
          Just a moment while we set up your next move.
        </p>
      </div>
    </div>
  );
}

export default BrandedLoader;

