import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import screenLogo from '../assets/animations/screen.png';
import { getDiscoverItems } from '../api/dashboardApi';

const fallbackShows = [
  { id: 'fallback-show-1', title: 'Midnight Sessions', description: 'Live performances and late-night energy.', category: 'Music', poster: screenLogo },
  { id: 'fallback-show-2', title: 'Creator Spotlight', description: 'A fast-paced showcase of rising talent.', category: 'Creators', poster: screenLogo },
  { id: 'fallback-show-3', title: 'Game Night Live', description: 'Interactive playtime with fans and hosts.', category: 'Gaming', poster: screenLogo },
  { id: 'fallback-show-4', title: 'Studio Q', description: 'Behind-the-scenes chats and fresh interviews.', category: 'Talk', poster: screenLogo },
  { id: 'fallback-show-5', title: 'After Hours', description: 'An upbeat night show for the community.', category: 'Lifestyle', poster: screenLogo },
  { id: 'fallback-show-6', title: 'The Drop', description: 'New releases, trends, and live reactions.', category: 'Culture', poster: screenLogo },
];

export default function MoreUpcomingShowsPage() {
  const [items, setItems] = useState(fallbackShows);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getDiscoverItems()
      .then((d) => {
        if (!mounted) return;
        const discovered = (d || []).filter((item) => item.type === 'show').slice(0, 24);
        setItems(discovered.length > 0 ? discovered : fallbackShows);
      })
      .catch(() => {
        if (mounted) {
          setItems(fallbackShows);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardShell title="More upcoming shows" subtitle="Browse the full lineup of shows coming next">
      <div className="mx-auto w-full max-w-6xl px-1 sm:px-0">
        <div className="mb-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 shadow-2xl shadow-black/20">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-amber-400">Expanded discovery</p>
              <h2 className="text-xl font-semibold text-white">See everything coming up</h2>
            </div>
            <Link to="/discover" className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
              Back to Discover
            </Link>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {['All shows', 'Live now', 'This week', 'Fresh picks'].map((label) => (
              <span key={label} className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-sm text-slate-300">
                {label}
              </span>
            ))}
          </div>

          <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {(loading ? fallbackShows : items).slice(0, 6).map((item) => (
              <article key={item.id} className="min-w-[72%] shrink-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 sm:min-w-[46%] lg:min-w-[30%]">
                <img src={item.poster || item.thumbnail} alt={item.title} className="h-40 w-full object-cover" />
                <div className="space-y-2 p-3">
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description || 'Fresh live show coming your way.'}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(loading ? fallbackShows : items).map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-sm">
              <img src={item.poster || item.thumbnail} alt={item.title} className="h-44 w-full object-cover" />
              <div className="space-y-2 p-4">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.description || 'Fresh live show coming your way.'}</p>
                <div className="flex items-center justify-between pt-2 text-sm text-slate-300">
                  <span>{item.category || 'Live event'}</span>
                  <button type="button" className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-300">
                    View details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
