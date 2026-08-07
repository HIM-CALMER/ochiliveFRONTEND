import { useEffect, useMemo, useState } from 'react';
// WalletShell is the landing hub for /wallet; wallet pages render as full screens
import DashboardShell from '../../components/DashboardShell';
import { getWalletSummary } from '../../api/dashboardApi';
import WalletNav from '../../components/wallet/WalletNav';

const defaultSummary = {
  availableBalance: undefined,
  pendingBalance: undefined,
  lifetimeEarnings: undefined,
  totalWithdrawn: undefined,
  platformCommission: undefined,
  settlementEta: '2 business days',
  revenueSources: {},
  recentTransactions: [],
  withdrawalHistory: [],
  alerts: [],
  currency: 'USD',
};

const navRoutes = [
  { label: 'Overview', to: '/wallet/overview' },
  { label: 'Revenue', to: '/wallet/revenue' },
  { label: 'Transactions', to: '/wallet/transactions' },
  { label: 'Withdrawals', to: '/wallet/withdrawals' },
];

export default function WalletShell() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWalletSummary()
      .then((data) => setWallet(data))
      .catch(() => setWallet(null))
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(
    () => ({
      ...defaultSummary,
      ...(wallet || {}),
      revenueSources: {
        ...defaultSummary.revenueSources,
        ...(wallet?.revenueSources || {}),
      },
      recentTransactions: wallet?.recentTransactions || [],
      withdrawalHistory: wallet?.withdrawalHistory || [],
      alerts: wallet?.alerts || [],
      currency: wallet?.currency || defaultSummary.currency,
    }),
    [wallet],
  );

  return (
    <DashboardShell title="Ochi Wallet" subtitle="Fast access to your creator finance tools.">
      <section className="space-y-6">
        <div className="border border-slate-800 bg-slate-950 p-5">
          <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Wallet workspace</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Creator wallet hub</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Access the wallet through compact section tiles and a concise summary so the page stays short and professional.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.85fr]">
          <div className="border border-slate-800 bg-slate-900 p-5">
            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Quick snapshot</p>
                <p className="mt-2 text-3xl font-semibold text-white">{loading ? 'Loading…' : `${summary.currency} ${summary.availableBalance?.toLocaleString() || '0'}`}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  A compact landing view with the most important wallet metrics.
                </p>
              </div>

              <div className="border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-2">
                  <span className="uppercase tracking-[0.28em] text-slate-500">Pending</span>
                  <span>{loading ? '—' : `${summary.currency} ${summary.pendingBalance?.toLocaleString() || '0'}`}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="uppercase tracking-[0.28em] text-slate-500">Lifetime</span>
                  <span className="text-white">{loading ? '—' : `${summary.currency} ${summary.lifetimeEarnings?.toLocaleString() || '0'}`}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="uppercase tracking-[0.28em] text-slate-500">Withdrawn</span>
                  <span className="text-white">{loading ? '—' : `${summary.currency} ${summary.totalWithdrawn?.toLocaleString() || '0'}`}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="page-section border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Wallet pages</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Choose a section</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Review balances, revenue, transactions or withdrawals in dedicated pages.
            </p>

            <div className="mt-5">
              <WalletNav routes={navRoutes} summary={summary} />
            </div>
          </div>
        </div>

      </section>
    </DashboardShell>
  );
}
