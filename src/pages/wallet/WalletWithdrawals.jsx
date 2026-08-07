import DashboardShell from '../../components/DashboardShell';
import WithdrawalHistory from '../../components/wallet/WithdrawalHistory';
import WithdrawalsSection from '../../components/wallet/WithdrawalsSection';
import useWalletSummary from '../../hooks/useWalletSummary';

export default function WalletWithdrawals() {
  const { wallet, loading } = useWalletSummary();
  const currency = wallet?.currency || 'USD';

  const safeWallet = wallet || {};
  const balanceValue = typeof safeWallet.availableBalance === 'number' ? safeWallet.availableBalance : 0;

  return (
    <DashboardShell title="Ochi Wallet" subtitle="Withdrawal controls and payout history">
      <div className="space-y-6">
        <div className="border border-slate-800 bg-slate-950 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Withdrawals</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Cash out safely</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Complete verification and manage payout requests with step-by-step guidance.
              </p>
            </div>
            <div className="bg-slate-900 px-5 py-4 text-sm text-slate-200">
              <p className="uppercase tracking-[0.24em] text-slate-500">Available balance</p>
              <p className="mt-2 text-2xl font-semibold text-white">{loading ? '—' : `${currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦'}${balanceValue.toLocaleString()}`}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <WithdrawalsSection
            balance={balanceValue}
            currency={currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦'}
            loading={loading}
          />
          <WithdrawalHistory history={safeWallet.withdrawalHistory || []} currency={currency} rate={1} loading={loading} />
        </div>
      </div>
    </DashboardShell>
  );
}
