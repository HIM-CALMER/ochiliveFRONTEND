import DashboardShell from '../../components/DashboardShell';
import RevenueTabs from '../../components/wallet/RevenueTabs';
import useWalletSummary from '../../hooks/useWalletSummary';

export default function WalletRevenue() {
  const { wallet, loading } = useWalletSummary();
  const currency = wallet?.currency || 'USD';
  const rate = 1;
  const sources = wallet?.revenueSources || {};
  const totalRevenue = Object.values(sources).reduce((sum, amount) => sum + (amount || 0), 0);

  return (
    <DashboardShell title="Ochi Wallet" subtitle="Revenue metrics for your creator wallet">
      <div className="space-y-6">
        <div className="page-section border border-slate-800 bg-slate-950 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Revenue detail</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Revenue performance</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Review how each revenue source contributes to your creator earnings.
              </p>
            </div>
            <div className="bg-slate-900 px-5 py-4 text-sm text-slate-200">
              <p className="uppercase tracking-[0.24em] text-slate-500">Total revenue</p>
              <p className="mt-2 text-2xl font-semibold text-white">{loading ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <RevenueTabs sources={sources} currency={currency} rate={rate} loading={loading} />
      </div>
    </DashboardShell>
  );
}
