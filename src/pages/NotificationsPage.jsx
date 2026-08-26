import { useEffect, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { getNotifications } from '../api/dashboardApi';

const typeStyles = {
  follow: 'bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20',
  like: 'bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/20',
  comment: 'bg-sky-500/10 text-sky-200 ring-1 ring-sky-500/20',
  'follow-back': 'bg-violet-500/10 text-violet-200 ring-1 ring-violet-500/20',
  mention: 'bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/20',
};

const typeLabel = {
  follow: 'Follow',
  like: 'Like',
  comment: 'Comment',
  'follow-back': 'Mutual',
  mention: 'Mention',
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <DashboardShell
      title="Notifications"
      subtitle="Social updates from people you follow and viewers engaging with your content."
    >
      <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-3 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-lg font-semibold text-white sm:text-xl">Notifications</h2>
              {unreadCount ? (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  {unreadCount} new
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">Follow activity, likes, mentions, and creator updates.</p>
          </div>
          <button className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 sm:text-sm">
            Mark all read
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Loading notifications...</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((note) => (
              <div
                key={note.id}
                className={`rounded-2xl border p-3 transition sm:p-4 ${note.unread ? 'border-slate-700 bg-slate-950/85' : 'border-slate-800 bg-slate-950/60'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase sm:h-10 sm:w-10 ${typeStyles[note.type] || 'bg-slate-800 text-slate-200'}`}>
                    {note.actor?.charAt(0)?.toUpperCase() || 'N'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-white sm:text-sm">{note.title}</p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] ${typeStyles[note.type] || 'bg-slate-800 text-slate-200'}`}>
                            {typeLabel[note.type] || 'Update'}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:text-xs">{note.username}</p>
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">{note.time}</span>
                    </div>

                    <p className="mt-2 text-sm leading-5 text-slate-300 sm:leading-6">{note.description}</p>
                  </div>
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

