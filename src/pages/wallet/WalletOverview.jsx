import DashboardShell from '../../components/DashboardShell';
import BalanceCard from '../../components/wallet/BalanceCard';
import WalletHeader from '../../components/wallet/WalletHeader';
import useWalletSummary from '../../hooks/useWalletSummary';

export default function WalletOverview() {
  const { wallet, loading } = useWalletSummary();
  const currency = wallet?.currency || 'USD';
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦';
  const safeWallet = wallet || {};
  const totalWithdrawn = typeof safeWallet.totalWithdrawn === 'number' ? safeWallet.totalWithdrawn : 0;
  const platformCommission = typeof safeWallet.platformCommission === 'number' ? safeWallet.platformCommission : 0;

  return (
    <DashboardShell title="Ochi Wallet" subtitle="Overview of your creator wallet balances" showBack backFallback="/wallet">
      <div className="space-y-6">
        <WalletHeader currency={currency} conversionRate={safeWallet.currency === 'USD' ? 1 : 1} />

        <section className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Left: primary snapshot (big balance + quick metrics) */}
        <div className="border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Top balance</p>
          <p className="mt-2 text-4xl font-semibold text-white">{loading ? '—' : `${symbol}${safeWallet.availableBalance?.toLocaleString() || '0'}`}</p>
          <p className="mt-2 text-sm text-slate-400">Available for withdrawal today.</p>

          <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2">
            <div className="border border-slate-800 bg-slate-900 p-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pending</p>
              <p className="mt-1 text-lg font-semibold text-white">{loading ? '—' : `${symbol}${safeWallet.pendingBalance?.toLocaleString() || '0'}`}</p>
              <p className="mt-1 text-sm text-slate-400">Funds being verified</p>
            </div>
            <div className="border border-slate-800 bg-slate-900 p-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Lifetime</p>
              <p className="mt-1 text-lg font-semibold text-white">{loading ? '—' : `${symbol}${safeWallet.lifetimeEarnings?.toLocaleString() || '0'}`}</p>
              <p className="mt-1 text-sm text-slate-400">Total earned</p>
            </div>
          </div>
        </div>

        {/* Right: actionable totals (stacked) */}
        <div className="space-y-4">
          <BalanceCard
            label="Total withdrawn"
            amount={totalWithdrawn}
            currencySymbol={symbol}
            detail="Paid out to your account"
            loading={loading}
          />
          <BalanceCard
            label="Platform commission"
            amount={platformCommission}
            currencySymbol={symbol}
            detail="Ochi fees and platform costs"
            accentText="text-rose-400"
            loading={loading}
          />
        </div>
      </section>
    </div>
    </DashboardShell>
  );
}
