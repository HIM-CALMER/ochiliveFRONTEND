import { useEffect } from 'react';

function ComedianPerformanceCard({ comedyProfile = {}, canRate = false, onRate, open = false, onOpen, onClose }) {
  const level = comedyProfile.level || 1;
  const levelName = comedyProfile.levelName || 'Rookie';
  const streamLimit = comedyProfile.monthlyStreamLimit || 4;
  const completedStreams = comedyProfile.completedLiveStreams || 0;
  const rating = comedyProfile.rating;
  const ratingCount = comedyProfile.ratingCount || 0;
  const progress = Math.min((completedStreams / streamLimit) * 100, 100);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="mt-5 flex w-full items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-left transition hover:border-slate-600 hover:bg-slate-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50 sm:px-5"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Performance profile</span>
          <span className="mt-1 block truncate text-sm font-semibold text-white">Level {level} · {levelName}</span>
        </span>
        <span className="shrink-0 text-xs font-medium text-slate-400">View details <span aria-hidden="true">→</span></span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 px-0 backdrop-blur-sm sm:items-center sm:px-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
          <section className="max-h-[88dvh] w-full overflow-y-auto rounded-t-2xl border border-slate-700 bg-slate-950 shadow-2xl sm:max-w-lg sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="performance-profile-title">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur sm:px-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">Performance profile</p>
                <h3 id="performance-profile-title" className="mt-1 text-lg font-semibold text-white">Level {level} · {levelName}</h3>
              </div>
              <button type="button" onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-lg text-slate-300 hover:text-white" aria-label="Close performance profile">×</button>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Audience rating</p>
                  <p className="mt-1 text-sm text-white">{ratingCount ? `${Number(rating).toFixed(1)} / 5` : 'Not rated yet'}</p>
                </div>
                <p className="text-xs text-slate-500">{ratingCount ? `${ratingCount} ratings` : 'Available after live sessions'}</p>
              </div>

              <div className="mt-4 grid divide-y divide-slate-800 rounded-xl border border-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Monthly access</p><p className="mt-1 text-sm font-semibold text-white">{streamLimit} sessions</p></div>
                <div className="px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Session limit</p><p className="mt-1 text-sm font-semibold text-white">{comedyProfile.maxStreamMinutes || 5} minutes</p></div>
                <div className="px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Ticketed shows</p><p className="mt-1 text-sm font-semibold text-slate-200">{comedyProfile.ticketPublishingEnabled ? 'Available' : 'Unlocks at Level 3'}</p></div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-slate-200">Rookie progress</span><span className="tabular-nums text-slate-400">{completedStreams} / {streamLimit} completed</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-slate-300 transition-all" style={{ width: `${progress}%` }} /></div>
                <p className="mt-2 text-xs leading-5 text-slate-500">Free shows only at Level 1. Ticketed shows become available at Level 3.</p>
              </div>

              {canRate ? (
                <div className="mt-5 flex flex-col gap-2 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs text-slate-400">Rate this comedian</span>
                  <div className="flex items-center gap-1" aria-label="Rate comedian from one to five">
                    {[1, 2, 3, 4, 5].map((score) => <button key={score} type="button" onClick={() => onRate(score)} className="h-8 w-8 rounded-md border border-slate-700 bg-slate-900 text-sm text-slate-300 transition hover:border-slate-400 hover:bg-slate-800 hover:text-white" aria-label={`Rate ${score} out of 5`}>{score}</button>)}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

export default ComedianPerformanceCard;
