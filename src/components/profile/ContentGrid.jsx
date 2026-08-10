const toneStyles = {
  plum: 'from-[#7d5f79] via-[#4b3c59] to-[#101322]',
  amber: 'from-[#b48555] via-[#55484f] to-[#101322]',
  slate: 'from-[#607084] via-[#32394c] to-[#101322]',
  rose: 'from-[#9c6c78] via-[#513f5c] to-[#101322]',
};

function ContentGrid({ items, tab, isOwnProfile }) {
  if (!items.length) {
    return (
      <div className="border-t border-slate-800 py-14 text-center">
        <p className="text-sm font-medium text-slate-300">{tab === 'reshared' ? 'No reshared posts yet.' : 'No posts yet.'}</p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">{isOwnProfile ? 'Publish your first live moment and start building your profile.' : 'This creator has not published anything here yet.'}</p>
        {isOwnProfile && tab === 'posts' ? <a href="/upload" className="mt-5 inline-flex border border-ochi-accent bg-ochi-accent px-4 py-2 text-sm font-semibold text-white">Create post</a> : null}
      </div>
    );
  }

  return (
    <div className="grid gap-px bg-slate-800 sm:grid-cols-2 lg:grid-cols-3" role="tabpanel">
      {items.map((item) => (
        <article key={item.id} className="group relative min-h-64 overflow-hidden bg-slate-950 p-5 transition-colors hover:bg-slate-900">
          <div className={`absolute inset-0 bg-gradient-to-br ${toneStyles[item.tone] || toneStyles.plum} opacity-80 transition-transform duration-500 group-hover:scale-105`} />
          <div className="relative flex min-h-56 flex-col justify-between">
            <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-white/60">
              <span>{item.category || (tab === 'reshared' ? 'Reshared post' : 'Post')}</span>
              <span>{item.duration || item.type || ''}</span>
            </div>
            <div>
              <p className="max-w-xs text-xl font-semibold leading-tight text-white">{item.title || 'Untitled post'}</p>
              <p className="mt-3 text-xs text-white/60">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently published'}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ContentGrid;