import { useEffect, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { getActivityFeed } from '../api/dashboardApi';

function ActivityPage() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

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
    >
      <div className="rounded-2xl bg-slate-900/95 p-6">
        {loading ? (
          <div className="text-slate-400">Loading activity feed...</div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-2xl bg-slate-950/95 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Recent activity</p>
                <p className="mt-2 text-2xl font-semibold text-white">{activity.length} updates</p>
              </div>
              <span className="rounded-full bg-rose-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-rose-300">Live stream status</span>
            </div>
            <div className="space-y-4">
              {activity.map((item) => (
                <article key={item.id} className="rounded-2xl bg-slate-950/95 px-5 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm text-slate-400">{item.category || 'Update'}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.time}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default ActivityPage;

