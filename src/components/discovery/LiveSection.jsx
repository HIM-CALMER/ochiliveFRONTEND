import React, { useEffect, useState } from 'react';
import { getVideoFeed } from '../../api/dashboardApi';

function Thumb({ src, title }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-800">
      <img src={src} alt={title} className="h-full w-full object-cover" />
    </div>
  );
}

export default function LiveSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    getVideoFeed()
      .then((d) => mounted && setItems(d.slice(0, 4)))
      .catch(() => {})
      .finally(() => {});
    return () => (mounted = false);
  }, []);

  return (
    <section className="mb-6">
      <h3 className="mb-3 px-1 text-2xl font-medium text-white">Live</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 w-full animate-pulse rounded-md bg-slate-800" />
            ))
          : items.map((it) => (
              <div key={it.id} className="overflow-hidden rounded-md bg-slate-800">
                <img src={it.thumbnail || it.poster} alt={it.title} className="h-28 w-full object-cover" />
              </div>
            ))}
      </div>
    </section>
  );
}
