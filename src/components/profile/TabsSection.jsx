function TabsSection({ activeTab, onChange }) {
  return (
    <div className="mt-10 flex gap-7 border-b border-slate-800" role="tablist" aria-label="Profile content">
      {[
        { id: 'posts', label: 'Posts' },
        { id: 'reshared', label: 'Reshared' },
      ].map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative pb-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {tab.label}
          {activeTab === tab.id ? <span className="absolute inset-x-0 -bottom-px h-0.5 bg-rose-300" /> : null}
        </button>
      ))}
    </div>
  );
}

export default TabsSection;