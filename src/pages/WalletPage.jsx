import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { getWalletSummary, initializeWalletFunding, verifyWalletFunding } from '../api/dashboardApi';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [fundAmount, setFundAmount] = useState('');
  const [funding, setFunding] = useState(false);
  const [fundMessage, setFundMessage] = useState('');

  useEffect(() => {
    getWalletSummary()
      .then((data) => {
        setWallet(data);
        setCurrency(data?.currency || 'USD');
      })
      .catch(() => setWallet(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) return;
    verifyWalletFunding(reference)
      .then((data) => {
        setWallet(data.wallet);
        setFundMessage(data.message);
      })
      .catch((error) => setFundMessage(error?.response?.data?.message || 'Payment verification failed.'))
      .finally(() => setSearchParams({}, { replace: true }));
  }, [searchParams, setSearchParams]);

  const handleAddFunds = async (event) => {
    event.preventDefault();
    setFunding(true);
    setFundMessage('');
    try {
      const result = await initializeWalletFunding(Number(fundAmount), currency);
      window.location.assign(result.authorizationUrl);
    } catch (error) {
      setFundMessage(error?.response?.data?.message || 'Unable to start payment.');
      setFunding(false);
    }
  };

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
      showBack
      backFallback="/home"
    >
      {loading ? (
        <div className="bg-slate-950 border border-slate-800 p-6 text-slate-400">Loading wallet data...</div>
      ) : (
        <div className="space-y-6">
          <WalletHeader currency={currency} conversionRate={currencyRate.toFixed(2)} />

          <section className="border border-rose-400/25 bg-gradient-to-r from-rose-500/10 via-slate-950 to-amber-500/10 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-rose-300">Wallet funding</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Add funds securely</h2>
                <p className="mt-2 text-sm text-slate-400">Use your balance to buy gifts and tip comedians during live shows.</p>
              </div>
              <form onSubmit={handleAddFunds} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <label className="sr-only" htmlFor="fund-amount">Amount</label>
                <input id="fund-amount" type="number" min="100" step="1" value={fundAmount} onChange={(event) => setFundAmount(event.target.value)} placeholder="Amount" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-rose-400 sm:w-32" required />
                <button type="submit" disabled={funding} className="rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60">{funding ? 'Opening...' : 'Add funds'}</button>
              </form>
            </div>
            {fundMessage ? <p className="mt-3 text-sm text-emerald-300">{fundMessage}</p> : null}
          </section>

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

