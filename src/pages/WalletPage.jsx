import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { getWalletSummary } from '../api/dashboardApi';
import BalanceCard from '../components/wallet/BalanceCard';
import CurrencySwitcher from '../components/wallet/CurrencySwitcher';
import RevenueTabs from '../components/wallet/RevenueTabs';
import TransactionTable from '../components/wallet/TransactionTable';
import WithdrawalsSection from '../components/wallet/WithdrawalsSection';
import WithdrawalHistory from '../components/wallet/WithdrawalHistory';
import WalletHeader from '../components/wallet/WalletHeader';

function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    getWalletSummary()
      .then((data) => {
        setWallet(data);
        setCurrency(data?.currency || 'USD');
      })
      .catch(() => setWallet(null))
      .finally(() => setLoading(false));
  }, []);

  const currencyRate = useMemo(() => {
    if (!wallet) return 1;
    const base = wallet.currency || 'USD';
    if (base === 'USD') return 1;
    const rates = { USD: 1, EUR: 0.93, GBP: 0.82, NGN: 133.5 };
    return rates[currency] / rates[base];
  }, [currency, wallet]);

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

  const summary = {
    ...defaultSummary,
    ...(wallet || {}),
    revenueSources: {
      ...defaultSummary.revenueSources,
      ...(wallet?.revenueSources || {}),
    },
    recentTransactions: wallet?.recentTransactions || [],
    withdrawalHistory: wallet?.withdrawalHistory || [],
    alerts: wallet?.alerts || [],
  };

  const alerts = summary.alerts || [];

  return (
    <DashboardShell
      title="Ochi Wallet"
      subtitle="A clean creator finance dashboard with the maturity and control of a modern digital bank."
    >
      {loading ? (
        <div className="bg-slate-950 border border-slate-800 p-6 text-slate-400">Loading wallet data...</div>
      ) : (
        <div className="space-y-6">
          <WalletHeader currency={currency} conversionRate={currencyRate.toFixed(2)} />

          <div className="grid gap-4 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-4 min-w-0">
              <div className="border border-slate-800 bg-slate-950 p-5 rounded-none">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Account summary</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Performance at a glance</h2>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-slate-400">
                    <span>Settlement ETA: {summary.settlementEta}</span>
                    <span>Conversion shown in {currency}</span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <BalanceCard
                    label="Available balance"
                    amount={summary.availableBalance}
                    loading={loading}
                    currencySymbol={currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦'}
                    detail="Funds ready for payout"
                  />
                  <BalanceCard
                    label="Pending balance"
                    amount={summary.pendingBalance}
                    loading={loading}
                    currencySymbol={currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦'}
                    detail="Settlement window processing"
                  />
                  <BalanceCard
                    label="Lifetime earnings"
                    amount={summary.lifetimeEarnings}
                    loading={loading}
                    currencySymbol={currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦'}
                    detail="Total creator revenue earned"
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <BalanceCard
                    label="Total withdrawn"
                    amount={summary.totalWithdrawn}
                    loading={loading}
                    currencySymbol={currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦'}
                    detail="Funds already paid out"
                  />
                  <BalanceCard
                    label="Platform commission"
                    amount={summary.platformCommission}
                    loading={loading}
                    currencySymbol={currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦'}
                    detail="Fees withheld from gross revenue"
                    accentText="text-rose-400"
                  />
                </div>
              </div>

              <RevenueTabs sources={summary.revenueSources} currency={currency} rate={currencyRate} loading={loading} />

              <TransactionTable transactions={summary.recentTransactions} currency={currency} rate={currencyRate} />
            </div>

            <aside className="space-y-4 min-w-0 w-full">
              <div className="border border-slate-800 bg-slate-950 p-5 rounded-none">
                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Quick actions</p>
                    <h2 className="mt-2 text-lg font-semibold text-white">Payout controls</h2>
                  </div>
                  <CurrencySwitcher value={currency} onChange={setCurrency} />
                </div>

                <div className="mt-5 space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="border border-slate-800 bg-slate-900 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{alert.title}</p>
                        <span className="text-xs uppercase tracking-[0.28em] text-slate-400">{alert.badge}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{alert.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <WithdrawalsSection balance={summary.availableBalance} currency={currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₦'} />

              <WithdrawalHistory history={summary.withdrawalHistory} currency={currency} rate={currencyRate} />
            </aside>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default WalletPage;

