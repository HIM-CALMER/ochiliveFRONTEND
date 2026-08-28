import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api/dashboardApi';
import useSocket from '../hooks/useSocket';

const typeStyles = {
  follow: 'bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20',
  like: 'bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/20',
  comment: 'bg-sky-500/10 text-sky-200 ring-1 ring-sky-500/20',
  'follow-back': 'bg-violet-500/10 text-violet-200 ring-1 ring-violet-500/20',
  mention: 'bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/20',
  save: 'bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/20',
  reshare: 'bg-violet-500/10 text-violet-200 ring-1 ring-violet-500/20',
};

const typeLabel = {
  follow: 'Follow',
  like: 'Like',
  comment: 'Comment',
  'follow-back': 'Mutual',
  mention: 'Mention',
  save: 'Save',
  reshare: 'Reshare',
};

const filters = [
  { key: 'all', label: 'All' },
  { key: 'like', label: 'Likes' },
  { key: 'comment', label: 'Comments' },
  { key: 'follow', label: 'Follows' },
];

const timeAgo = (value) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

const normalizeIncoming = (note) => {
  const actor = note.actorName || note.actorUsername || 'Someone';
  const action = { like: 'liked your video.', comment: 'commented on your video.', save: 'saved your video.', follow: 'started following you.', 'follow-back': 'followed you back.', reshare: 'reshared your post.', mention: 'mentioned you in a post.' }[note.type] || 'interacted with your content.';
  return {
    ...note,
    actor,
    actorUsername: note.actorUsername ? `@${note.actorUsername.replace(/^@/, '')}` : '',
    title: { like: 'Video liked', comment: 'New comment', save: 'Video saved', follow: 'New follower', 'follow-back': 'Followed back', reshare: 'Post reshared', mention: 'Mentioned in a post' }[note.type] || 'New activity',
    description: note.type === 'comment' ? `${actor} said: “${note.comment || ''}”` : `${actor} ${action}`,
    unread: true,
  };
};

const ActionIcon = ({ type }) => {
  const glyph = { like: '♥', comment: '•••', save: '▣', follow: '+', 'follow-back': '+', reshare: '↗', mention: '@' }[type] || '•';
  return <span className="text-[11px] font-bold" aria-hidden="true">{glyph}</span>;
};

function NotificationsPage() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNotifications(filter)
      .then((data) => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    if (!socket) return undefined;
    const handleNewNotification = (incoming) => {
      const note = normalizeIncoming(incoming);
      if (filter !== 'all' && filter !== note.type) return;
      let added = false;
      setNotifications((current) => {
        if (current.some((item) => item.id === note.id)) return current;
        added = true;
        return [note, ...current];
      });
      if (added) setUnreadCount((current) => current + 1);
    };
    const handleReconnect = () => {
      getNotifications(filter).then((data) => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }).catch(() => {});
    };
    socket.on('notification:new', handleNewNotification);
    socket.on('connect', handleReconnect);
    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('connect', handleReconnect);
    };
  }, [filter, socket]);

  const openNotification = async (note) => {
    if (note.unread) {
      await markNotificationRead(note.id).catch(() => {});
      setNotifications((current) => current.map((item) => (item.id === note.id ? { ...item, unread: false } : item)));
      setUnreadCount((current) => Math.max(0, current - 1));
    }
    if (note.actorUsername && ['follow', 'follow-back'].includes(note.type)) navigate(`/profile/${note.actorUsername.replace(/^@/, '')}`);
    else navigate('/home');
  };

  const markAllRead = async () => {
    await markAllNotificationsRead().catch(() => {});
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
    setUnreadCount(0);
  };

  return (
    <DashboardShell
      title="Notifications"
      subtitle="Social updates from people you follow and viewers engaging with your content."
      showSearch={false}
      showBack
      backFallback="/home"
    >
      <div className="overflow-hidden bg-slate-950/40">
        <div className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Notifications</h2>
              {unreadCount ? (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  {unreadCount} new
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Your latest interactions</p>
          </div>
          <button type="button" onClick={markAllRead} disabled={!unreadCount} className="text-xs font-semibold text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm">
            Mark all read
          </button>
        </div>

        <nav className="sticky top-0 z-10 flex gap-6 overflow-x-auto border-b border-slate-800 bg-slate-950/95 px-3 no-scrollbar backdrop-blur-xl sm:px-6" aria-label="Notification filters">
          {filters.map((item) => (
            <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={`relative shrink-0 border-b-2 py-3 text-sm font-semibold transition ${filter === item.key ? 'border-rose-300 text-white' : 'border-transparent text-slate-500 hover:text-slate-200'}`}>
              {item.label}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="space-y-px border-t border-slate-800">
            {[1, 2, 3].map((item) => <div key={item} className="flex items-center gap-3 px-3 py-3 sm:px-6"><div className="h-11 w-11 animate-pulse rounded-full bg-slate-800" /><div className="flex-1 space-y-2"><div className="h-3 w-3/5 animate-pulse bg-slate-800" /><div className="h-2 w-2/5 animate-pulse bg-slate-900" /></div><div className="h-3 w-6 animate-pulse bg-slate-900" /></div>)}
          </div>
        ) : !notifications.length ? (
          <div className="border-t border-slate-800 px-4 py-16 text-center"><p className="text-base font-semibold text-white">You’re all caught up</p><p className="mt-2 text-sm text-slate-500">When people interact with your content, it will appear here.</p></div>
        ) : (
          <div>
            {notifications.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => openNotification(note)}
                className={`flex w-full items-center gap-3 border-b border-slate-900 px-3 py-3 text-left transition hover:bg-slate-900/70 sm:px-6 ${note.unread ? 'bg-slate-900/45' : ''}`}
              >
                  <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold uppercase ${typeStyles[note.type] || 'bg-slate-800 text-slate-200'}`}>
                    {note.actorProfilePictureUrl ? <img src={note.actorProfilePictureUrl} alt="" className="h-full w-full object-cover" /> : (note.actor?.charAt(0)?.toUpperCase() || 'N')}
                    {note.unread ? <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-rose-400 ring-2 ring-slate-950" /> : null}
                  </div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-200"><strong className="font-bold text-white">{note.actor || 'Someone'}</strong> <span className="text-slate-300">{note.description?.replace(`${note.actor} `, '') || note.title}</span></p>{note.comment ? <p className="mt-1 truncate text-xs text-slate-400">“{note.comment}”</p> : null}</div>
                  <span className={`hidden h-7 w-7 items-center justify-center rounded-full sm:flex ${typeStyles[note.type] || 'bg-slate-800 text-slate-200'}`} title={typeLabel[note.type] || 'Activity'}><ActionIcon type={note.type} /></span>
                  <time className="shrink-0 text-xs text-slate-500">{note.createdAt ? timeAgo(note.createdAt) : note.time}</time>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default NotificationsPage;

