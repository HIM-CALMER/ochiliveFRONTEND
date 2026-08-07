import { useState } from 'react';

const revenueMap = [
  { key: 'ticketSales', label: 'Ticket Sales' },
  { key: 'tips', label: 'Tips' },
  { key: 'gifts', label: 'Gifts' },
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'merchandise', label: 'Merchandise' },
  { key: 'sponsorships', label: 'Sponsorships' },
  { key: 'advertising', label: 'Advertising' },
  { key: 'bonuses', label: 'Bonuses' },
];

export default function RevenueTabs({ sources = {}, currency = 'USD', rate = 1, loading = false }) {
  const [activeTab, setActiveTab] = useState('overview');
  const values = Object.values(sources || {});
  const total = values.length ? values.reduce((sum, value) => sum + (value || 0), 0) : 0;

  const formatValue = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value * rate);

  if (loading) {
    return (
      <section className="border border-slate-800 bg-slate-950 p-5 rounded-none">
        <div className="h-36 animate-pulse rounded-none bg-slate-900" />
      </section>
    );
  }

  return (
    <section className="border border-slate-800 bg-slate-950 p-5 rounded-none">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Revenue sources</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Breakdown by channel</h2>
        </div>
        <div className="flex gap-1 text-xs uppercase tracking-[0.24em] text-slate-400">
          {['overview', 'breakdown'].map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 transition ${
                activeTab === tab ? 'bg-slate-800 text-white' : 'hover:bg-slate-900 text-slate-400'
              }`}
            >
              {tab === 'overview' ? 'Overview' : 'Sources'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' ? (
        total === 0 ? (
          <div className="mt-5 p-6 text-center text-sm text-slate-400">No revenue data available yet. Connect your account or wait for activity to appear.</div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="border border-slate-800 bg-slate-900 p-4 rounded-none">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Gross revenue</p>
              <p className="mt-3 text-2xl font-semibold text-white">{formatValue(total)}</p>
            </div>
            <div className="border border-slate-800 bg-slate-900 p-4 rounded-none">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Commission</p>
              <p className="mt-3 text-2xl font-semibold text-rose-400">{formatValue(total * 0.12)}</p>
            </div>
            <div className="border border-slate-800 bg-slate-900 p-4 rounded-none">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Net revenue</p>
              <p className="mt-3 text-2xl font-semibold text-white">{formatValue(total * 0.88)}</p>
            </div>
            <div className="border border-slate-800 bg-slate-900 p-4 rounded-none">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active sources</p>
              <p className="mt-3 text-2xl font-semibold text-white">{revenueMap.filter(s => (sources[s.key] || 0) > 0).length}</p>
            </div>
          </div>
        )
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {total === 0 ? (
            <div className="p-6 text-sm text-slate-400">No breakdown available.</div>
          ) : (
            revenueMap.map((source) => (
              <div key={source.key} className="border border-slate-800 bg-slate-900 p-4 rounded-none">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{source.label}</p>
                  <p className="text-sm text-slate-400">{formatValue(sources[source.key] || 0)}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden bg-slate-800">
                  <div
                    className="h-full bg-rose-500"
                    style={{ width: `${Math.min(100, ((sources[source.key] || 0) / total) * 100)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
