function ComedianPerformanceCard({ comedyProfile = {} }) {
  const level = comedyProfile.level || 1;
  const levelName = comedyProfile.levelName || 'Rookie';
  const streamLimit = comedyProfile.monthlyStreamLimit || 4;
  const completedStreams = comedyProfile.completedLiveStreams || 0;
  const rating = comedyProfile.rating;
  const ratingCount = comedyProfile.ratingCount || 0;
  const progress = Math.min((completedStreams / streamLimit) * 100, 100);

  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80" aria-label="Comedian performance details">
      <div className="border-b border-slate-800 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">Performance profile</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Level {level} · {levelName}</h3>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">Comedian</span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Build a trusted performance record through consistent live sessions and audience feedback.</p>
        </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Audience rating</p>
            <p className="mt-1 text-sm font-semibold text-white">{ratingCount ? `${Number(rating).toFixed(1)} / 5` : 'Not rated yet'}</p>
            <p className="mt-1 text-xs text-slate-500">{ratingCount ? `${ratingCount} ratings` : 'Available after live sessions'}</p>
          </div>
        </div>
      </div>

      <div className="grid divide-y divide-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-4 py-3 sm:px-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Monthly access</p>
          <p className="mt-1 text-sm font-semibold text-white">{streamLimit} live sessions</p>
        </div>
        <div className="px-4 py-3 sm:px-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Session limit</p>
          <p className="mt-1 text-sm font-semibold text-white">{comedyProfile.maxStreamMinutes || 5} minutes</p>
        </div>
        <div className="px-4 py-3 sm:px-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Ticketed shows</p>
          <p className="mt-1 text-sm font-semibold text-slate-200">{comedyProfile.ticketPublishingEnabled ? 'Available' : 'Unlocks at Level 3'}</p>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-200">Rookie progress</p>
            <p className="mt-1 text-xs text-slate-500">Complete live sessions to build your record.</p>
          </div>
          <span className="text-xs tabular-nums text-slate-400">{completedStreams} / {streamLimit} completed</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-slate-300 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">Free shows only at Level 1. Ticketed shows become available at Level 3.</p>
      </div>
    </section>
  );
}

export default ComedianPerformanceCard;
