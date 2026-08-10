function StatsBar({ stats }) {
  const items = [
    { label: 'Followers', value: stats.followers?.toLocaleString() || '0' },
    { label: 'Following', value: stats.following?.toLocaleString() || '0' },
  ];

  return (
    <div className="mt-9 flex max-w-sm border-y border-slate-800 py-4">
      {items.map((item, index) => (
        <div key={item.label} className={`flex-1 ${index === 1 ? 'border-l border-slate-800 pl-6' : 'pr-6'}`}>
          <p className="text-xl font-semibold text-white">{item.value}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;