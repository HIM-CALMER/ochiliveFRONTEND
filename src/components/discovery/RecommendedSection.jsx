import React, { useEffect, useState } from 'react';
import { getDiscoverItems } from '../../api/dashboardApi';

function RecItem({ src, title }) {
  return (
    <div className="flex items-center gap-4 overflow-hidden rounded-lg bg-slate-800 p-3">
      <img src={src} alt={title} className="h-16 w-28 flex-shrink-0 object-cover" />
      <div className="flex-1">
        <div className="h-4 w-3/4 rounded bg-slate-700" />
        <div className="mt-2 h-3 w-1/2 rounded bg-slate-700" />
      </div>
    </div>
  );
}

export default function RecommendedSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    getDiscoverItems()
      .then((d) => mounted && setItems((d || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => {});
    return () => (mounted = false);
  }, []);

  return (
    <section className="mb-6">
      <h3 className="mb-3 px-1 text-lg font-semibold text-white">Recommended</h3>
      <div className="flex flex-col gap-3">
        {items.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-slate-800" />
            ))
          : items.map((it) => (
              <div key={it.id} className="overflow-hidden rounded-lg bg-slate-800">
                <RecItem key={it.id} src={it.poster || it.thumbnail} title={it.title} />
              </div>
            ))}
      </div>
    </section>
  );
}
