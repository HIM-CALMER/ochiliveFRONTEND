import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVideoFeed } from '../../api/dashboardApi';

function Thumb({ src, title }) {
  return (
    <div className="relative aspect-[1.35] w-full overflow-hidden bg-slate-800">
      <img src={src} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/10" />
    </div>
  );
}

function formatViewers(value) {
  const viewers = Number(value || 0);
  if (viewers >= 1000) return `${(viewers / 1000).toFixed(viewers >= 10000 ? 0 : 1)}k`;
  return viewers.toLocaleString();
}

function getInitials(name) {
  return String(name || 'Live').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function LiveSection() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getVideoFeed('recent_live')
      .then((payload) => {
        const nextItems = Array.isArray(payload) ? payload.filter((item) => item?.type === 'live' || item?.isLive).slice(0, 4) : [];
        if (mounted) setItems(nextItems);
      })
      .catch(() => {
        if (mounted) setItems([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-300">On air now</p>
          <h3 className="text-2xl font-semibold tracking-tight text-white">Live comedy</h3>
        </div>
        {items.length ? <span className="text-xs text-slate-500">{items.length} live now</span> : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950">
              <div className="aspect-[1.35] animate-pulse bg-slate-800" />
              <div className="space-y-2 p-3.5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-slate-800" />
                <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((it) => {
            const creatorName = it.creatorName || 'Live comedian';
            const thumbnail = it.thumbnailUrl || it.thumbnail || it.poster;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => navigate(`/live/${it.id}`)}
                className="group overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950 text-left shadow-[0_16px_40px_rgba(2,6,23,0.22)] transition duration-200 hover:-translate-y-1 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-300/60"
              >
                <div className="relative">
                  <Thumb src={thumbnail} title={it.title || 'Live comedy'} />
                  <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
                    Live
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/75 px-2 py-1 text-[11px] font-medium text-slate-100 backdrop-blur-sm">
                    {formatViewers(it.views)} watching
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-300/15 text-xs font-bold text-rose-200 ring-1 ring-rose-300/20">
                    {getInitials(creatorName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{it.title || 'Live comedy'}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{creatorName}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 px-5 py-8 text-center">
          <p className="text-sm font-semibold text-slate-200">No comedians are live right now</p>
          <p className="mt-1 text-xs text-slate-500">Check back soon for the next live set.</p>
        </div>
      )}
    </section>
  );
}
