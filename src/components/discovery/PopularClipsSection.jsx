import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVideoFeed } from '../../api/dashboardApi';

function Clip({ src }) {
  return (
    <div className="overflow-hidden rounded-xl bg-slate-800">
      <img src={src} className="h-56 w-full object-cover" alt="clip" />
    </div>
  );
}

export default function PopularClipsSection() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getVideoFeed()
      .then((d) => mounted && setItems((d || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => {});
    return () => (mounted = false);
  }, []);

  const visibleItems = items.length > 0 ? items : Array.from({ length: 6 }, (_, i) => ({ id: `placeholder-${i}` }));

  return (
    <section className="mb-6">
      <h3 className="mb-3 px-1 text-lg font-semibold text-white">Popular clips</h3>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar scroll-smooth">
        {visibleItems.map((it, index) =>
          items.length > 0 ? (
            <div key={it.id} className="min-w-[70%] sm:min-w-[48%] lg:min-w-[32%] overflow-hidden rounded-xl bg-slate-800">
              <img src={it.thumbnail || it.poster} alt={it.title} className="h-48 sm:h-72 w-full object-cover" />
            </div>
          ) : (
            <div key={it.id || index} className="h-48 min-w-[70%] sm:h-72 sm:min-w-[48%] lg:min-w-[32%] animate-pulse rounded-xl bg-slate-800" />
          )
        )}
        <button
          type="button"
          onClick={() => navigate('/discover/more-popular-clips')}
          className="flex min-w-[70%] shrink-0 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-6 text-center text-sm font-medium text-slate-200 sm:min-w-[48%] lg:min-w-[32%]"
        >
          <span className="mb-2 text-2xl text-amber-400">↗</span>
          <span>See more</span>
        </button>
      </div>
    </section>
  );
}
