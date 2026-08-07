import { useEffect, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { getNotifications } from '../api/dashboardApi';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell
      title="Notifications"
      subtitle="Stay on top of new messages, wallet updates, and trending room alerts from your workspace."
    >
      <div className="rounded-2xl bg-slate-900/95 p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <p className="mt-1 text-sm text-slate-400">Stay on top of new messages, wallet updates, and trending alerts.</p>
          </div>
          <button className="rounded-full bg-slate-950/90 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-900/80">
            Mark all read
          </button>
        </div>

        {loading ? (
          <div className="text-slate-400">Loading notifications...</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((note) => (
              <div key={note.id} className="rounded-2xl bg-slate-950/95 px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{note.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{note.description}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{note.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default NotificationsPage;

