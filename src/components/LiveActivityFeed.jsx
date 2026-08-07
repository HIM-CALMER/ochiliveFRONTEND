import { useEffect, useState } from 'react';

const activities = [
  { id: 1, type: 'live', user: 'Sarah L.', action: 'just started live', icon: 'ðŸŽ¤' },
  { id: 2, type: 'watch', count: '1,240', action: 'people watching now', icon: 'ðŸ‘ï¸' },
  { id: 3, type: 'join', user: 'Marcus B.', action: 'joined the stream', icon: 'âœ‹' },
  { id: 4, type: 'gift', user: 'Tunde', action: 'sent a gift ðŸŽ', icon: 'ðŸŽ' },
  { id: 5, type: 'stream', time: '2:30', action: 'New performance starts in', icon: 'â±ï¸' },
  { id: 6, type: 'live', user: 'Alex K.', action: 'now performing', icon: 'ðŸŽ­' },
  { id: 7, type: 'milestone', count: '500+', action: 'creators on platform', icon: 'ðŸŒŸ' },
  { id: 8, type: 'watch', count: '50K+', action: 'viewers online', icon: 'ðŸ“Š' },
];

export default function LiveActivityFeed() {
  const [displayActivities, setDisplayActivities] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const isDismissed = localStorage.getItem('ochiLiveActivityDismissed');
    if (isDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  // Handle close action
  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('ochiLiveActivityDismissed', 'true');
    }, 300);
  };

  useEffect(() => {
    // Rotate through activities
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Show 3 activities at a time
    const items = [];
    for (let i = 0; i < 3; i++) {
      const idx = (activeIndex + i) % activities.length;
      items.push({ ...activities[idx], position: i });
    }
    setDisplayActivities(items);
  }, [activeIndex]);

  return (
    <div className={`fixed bottom-8 right-8 z-50 w-80 max-w-[calc(100vw-2rem)] transition-all duration-300 ${
      isClosing ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
    } ${!isVisible ? 'hidden' : ''}`}>
      {/* Container */}
      <div className="rounded-lg border border-[var(--ochi-accent)]/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl shadow-2xl shadow-[var(--ochi-accent)]/10 p-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-rose-300">
              Live Activity
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Now
            </div>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/30 text-slate-400 transition-all duration-200 hover:bg-slate-950/60 hover:text-slate-200"
              aria-label="Close live activity feed"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-3">
          {displayActivities.map((activity) => (
            <div
              key={`${activity.id}-${activity.position}`}
              className="animate-fade-in group relative overflow-hidden rounded-md bg-slate-950/95 border border-slate-700/30 p-3 transition-all duration-300 hover:border-[var(--ochi-accent)]/40 hover:bg-slate-950/60"
              style={{
                animation: `fadeIn 0.5s ease-out ${activity.position * 100}ms backwards`,
              }}
            >
              {/* Glow on hover */}
              <div className="absolute -inset-px rounded-md opacity-0 transition duration-300 group-hover:opacity-100 -z-10 blur-lg bg-gradient-to-r from-[var(--ochi-accent)]/20 to-transparent" />

              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="mt-0.5 text-lg flex-shrink-0">{activity.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {activity.type === 'live' && (
                    <>
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {activity.user}
                      </p>
                      <p className="text-xs text-slate-400">{activity.action}</p>
                    </>
                  )}
                  {activity.type === 'watch' && (
                    <p className="text-sm text-slate-300">
                      <span className="font-bold text-[var(--ochi-accent)]">{activity.count}</span>
                      {' '}
                      <span className="text-slate-400">{activity.action}</span>
                    </p>
                  )}
                  {activity.type === 'join' && (
                    <>
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {activity.user}
                      </p>
                      <p className="text-xs text-slate-400">{activity.action}</p>
                    </>
                  )}
                  {activity.type === 'gift' && (
                    <>
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {activity.user}
                      </p>
                      <p className="text-xs text-slate-400">{activity.action}</p>
                    </>
                  )}
                  {activity.type === 'stream' && (
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-400">{activity.action}</span>
                      {' '}
                      <span className="font-bold text-[var(--ochi-accent)]">{activity.time}</span>
                    </p>
                  )}
                  {activity.type === 'milestone' && (
                    <p className="text-sm text-slate-300">
                      <span className="font-bold text-[var(--ochi-accent)]">{activity.count}</span>
                      {' '}
                      <span className="text-slate-400">{activity.action}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <button className="w-full rounded-lg bg-[var(--ochi-accent)]/10 border border-[var(--ochi-accent)]/30 px-3 py-2 text-xs font-semibold text-[var(--ochi-accent)] transition-all duration-300 hover:border-[var(--ochi-accent)]/60 hover:bg-[var(--ochi-accent)]/20">
            Join the Action
          </button>
        </div>
      </div>
    </div>
  );
}

