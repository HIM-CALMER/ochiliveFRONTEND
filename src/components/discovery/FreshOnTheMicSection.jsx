import React, { useEffect, useState } from 'react';
import { getDiscoverItems } from '../../api/dashboardApi';

export default function FreshOnTheMicSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    getDiscoverItems()
      .then((d) => mounted && setItems((d || []).filter((i) => i.type === 'creator').slice(0, 4)))
      .catch(() => {})
      .finally(() => {});
    return () => (mounted = false);
  }, []);

  return (
    <section className="mb-6">
      <h3 className="mb-3 px-1 text-lg font-semibold text-white">Fresh on the mic</h3>
      <div className="flex gap-4">
        {items.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 w-20 animate-pulse rounded-full bg-slate-900/80" />
            ))
          : items.map((it) => (
              <div key={it.id} className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-900/80">
                <img src={it.avatar || it.poster} alt={it.title} className="h-full w-full object-cover" />
              </div>
            ))}
      </div>
    </section>
  );
}
