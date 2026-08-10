function StatsBar({ stats, onSelect }) {
  const items = [
    { label: 'Followers', value: stats.followers?.toLocaleString() || '0' },
    { label: 'Following', value: stats.following?.toLocaleString() || '0' },
    { label: 'Posts', value: stats.posts?.toLocaleString() || '0' },
  ];

  return (
    <div className="mt-8 grid max-w-lg grid-cols-3 border-y border-slate-800 py-4">
      {items.map((item, index) => (
        <button key={item.label} type="button" onClick={() => onSelect?.(item.label.toLowerCase())} className={`text-left transition hover:bg-slate-900 ${index > 0 ? 'border-l border-slate-800 pl-4 sm:pl-6' : 'pr-4 sm:pr-6'}`}>
          <p className="text-xl font-semibold text-white">{item.value}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:text-xs">{item.label}</p>
        </button>
      ))}
    </div>
  );
}

export default StatsBar;