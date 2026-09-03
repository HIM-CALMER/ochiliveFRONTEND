import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { getActivityFeed } from '../api/dashboardApi';

function ActivityPage() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All activity' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'social', label: 'Social' },
  ];

  const filteredActivity = useMemo(() => {
    if (activeFilter === 'wallet') return activity.filter((item) => item.wallet);
    if (activeFilter === 'social') return activity.filter((item) => item.notification);
    return activity;
  }, [activity, activeFilter]);

  useEffect(() => {
    getActivityFeed()
      .then((data) => setActivity(data))
      .catch(() => setActivity([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell
      title="Actionable activity feed"
      subtitle="A mature activity stream for creator updates, key notifications, and real-time event insights."
      showSearch={false}
      showBack
      backFallback="/home"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/75 shadow-[0_20px_70px_rgba(2,6,23,0.28)]">
        {loading ? (
          <div className="space-y-4 p-4 sm:p-6">
            <div className="h-24 animate-pulse rounded-xl bg-slate-900" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-900" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-900" />
          </div>
        ) : (
          <div>
            <div className="border-b border-slate-800 px-4 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Your timeline</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">What is happening</h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">A single place for real social activity and wallet movements.</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-semibold text-white">{activity.length}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">total updates</p>
                </div>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Activity filters">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition ${activeFilter === filter.id ? 'border-slate-200 bg-slate-200 text-slate-950' : 'border-slate-700 bg-slate-900/70 text-slate-400 hover:border-slate-500 hover:text-white'}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {filteredActivity.length === 0 ? (
                <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-slate-800 px-5 text-center">
                  <div>
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-slate-300">—</div>
                    <p className="mt-3 text-sm font-medium text-white">Nothing in this view yet</p>
                    <p className="mt-1 text-xs text-slate-500">Real activity will appear here as people interact with you or your wallet changes.</p>
                  </div>
                </div>
              ) : (
                <div className="relative space-y-3 before:absolute before:bottom-5 before:left-[19px] before:top-5 before:w-px before:bg-slate-800 sm:before:left-[23px]">
                  {filteredActivity.map((item) => (
                    <article key={item.id} className="group relative flex gap-3 rounded-xl border border-transparent px-1 py-3 transition hover:border-slate-800 hover:bg-slate-900/45 sm:gap-4 sm:px-2">
                      <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold sm:h-11 sm:w-11 ${item.wallet ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>
                        {item.wallet ? '$' : '•'}
                      </div>
                      <div className="min-w-0 flex-1 py-0.5">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold text-white sm:text-base">{item.title}</h2>
                            <p className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${item.wallet ? 'text-emerald-300' : 'text-slate-500'}`}>{item.category || 'Update'}</p>
                          </div>
                          <time className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-slate-500">{item.time}</time>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                        {item.wallet ? (
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                            <span>Status: <strong className="font-medium text-slate-300">{item.wallet.status}</strong></span>
                            {item.wallet.reference ? <span className="max-w-full truncate">Ref: {item.wallet.reference}</span> : null}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default ActivityPage;

