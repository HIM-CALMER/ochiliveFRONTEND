function StatsBar({ stats, onSelect }) {
  const items = [
    { label: 'Followers', value: stats.followers?.toLocaleString() || '0', key: 'followers' },
    { label: 'Following', value: stats.following?.toLocaleString() || '0', key: 'following' },
    { label: 'Posts', value: stats.posts?.toLocaleString() || '0', key: 'posts' },
  ];

  return (
    <div className="mt-8 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
      {items.map((item, index) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onSelect?.(item.key)}
          className={`rounded-xl border border-slate-800 bg-slate-900/80 px-2 py-3 text-left transition hover:border-slate-600 hover:bg-slate-900 active:scale-[0.99] sm:rounded-2xl sm:px-4 sm:py-4 ${index > 0 ? 'sm:px-5' : ''}`}
        >
          <p className="text-lg font-semibold text-white sm:text-xl">{item.value}</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-slate-500 sm:text-[10px] sm:text-xs">{item.label}</p>
        </button>
      ))}
    </div>
  );
}

export default StatsBar;