import TransactionTable from '../../components/wallet/TransactionTable';
import useWalletSummary from '../../hooks/useWalletSummary';
import DashboardShell from '../../components/DashboardShell';

export default function WalletTransactions() {
  const { wallet, loading } = useWalletSummary();
  const currency = wallet?.currency || 'USD';
  const rate = 1;

  return (
    <DashboardShell title="Ochi Wallet" subtitle="Transaction history" showBack backFallback="/wallet">
    <div className="space-y-4">
      <div className="rounded-none border border-slate-800 bg-slate-950 p-5">
        <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Transaction history</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Activity ledger</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          All wallet transactions are tracked here, with gross, commission, net, and payout status.
        </p>
      </div>
      <TransactionTable transactions={wallet?.recentTransactions || []} currency={currency} rate={rate} loading={loading} />
    </div>
    </DashboardShell>
  );
}
