import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import screenLogo from '../assets/animations/screen.png';
import { getVideoFeed } from '../api/dashboardApi';

const fallbackClips = [
  { id: 'fallback-clip-1', title: 'Best reactions', description: 'Short, high-energy clips with instant impact.', category: 'Highlights', thumbnail: screenLogo },
  { id: 'fallback-clip-2', title: 'Creator takeover', description: 'A compact look at the most engaging moments.', category: 'Creators', thumbnail: screenLogo },
  { id: 'fallback-clip-3', title: 'Live burst', description: 'Moments that exploded in the chat.', category: 'Live', thumbnail: screenLogo },
  { id: 'fallback-clip-4', title: 'Fan favorite', description: 'The clips people keep replaying.', category: 'Community', thumbnail: screenLogo },
  { id: 'fallback-clip-5', title: 'Quick watch', description: 'Fast clips with a punchy story.', category: 'Shorts', thumbnail: screenLogo },
  { id: 'fallback-clip-6', title: 'Trending now', description: 'The clips everyone is talking about.', category: 'Trending', thumbnail: screenLogo },
];

export default function MorePopularClipsPage() {
  const [items, setItems] = useState(fallbackClips);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getVideoFeed()
      .then((d) => {
        if (!mounted) return;
        const discovered = (d || []).slice(0, 24);
        setItems(discovered.length > 0 ? discovered : fallbackClips);
      })
      .catch(() => {
        if (mounted) {
          setItems(fallbackClips);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardShell title="More popular clips" subtitle="Watch the best clips from creators and live moments">
      <div className="mx-auto w-full max-w-6xl px-1 sm:px-0">
        <div className="mb-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 shadow-2xl shadow-black/20">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-amber-400">Expanded discovery</p>
              <h2 className="text-xl font-semibold text-white">Explore more of what people are watching</h2>
            </div>
            <Link to="/discover" className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
              Back to Discover
            </Link>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {['Trending', 'Newest', 'Most viewed', 'Creator picks'].map((label) => (
              <span key={label} className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-sm text-slate-300">
                {label}
              </span>
            ))}
          </div>

          <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {(loading ? fallbackClips : items).slice(0, 6).map((item) => (
              <article key={item.id} className="min-w-[72%] shrink-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 sm:min-w-[46%] lg:min-w-[30%]">
                <img src={item.thumbnail || item.poster} alt={item.title} className="h-40 w-full object-cover" />
                <div className="space-y-2 p-3">
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description || 'Trending clip from the community.'}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(loading ? fallbackClips : items).map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-sm">
              <img src={item.thumbnail || item.poster} alt={item.title} className="h-48 w-full object-cover" />
              <div className="space-y-2 p-4">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.description || 'Trending clip from the community.'}</p>
                <div className="flex items-center justify-between pt-2 text-sm text-slate-300">
                  <span>{item.category || 'Highlight'}</span>
                  <button type="button" className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-300">
                    Play clip
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
