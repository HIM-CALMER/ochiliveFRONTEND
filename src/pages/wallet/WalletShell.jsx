import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// WalletShell is the landing hub for /wallet; wallet pages render as full screens
import DashboardShell from '../../components/DashboardShell';
import { getWalletSummary, initializeWalletFunding, verifyWalletFunding } from '../../api/dashboardApi';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [fundAmount, setFundAmount] = useState('');
  const [funding, setFunding] = useState(false);
  const [fundMessage, setFundMessage] = useState('');
  const [showFundingModal, setShowFundingModal] = useState(false);

  useEffect(() => {
    getWalletSummary()
      .then((data) => setWallet(data))
      .catch(() => setWallet(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
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
    if (!Number.isFinite(Number(fundAmount)) || Number(fundAmount) < 100) {
      setFundMessage('Enter at least 100 to continue.');
      return;
    }
    setFunding(true);
    setFundMessage('');
    try {
      const result = await initializeWalletFunding(Number(fundAmount), summary.currency);
      window.location.assign(result.authorizationUrl);
    } catch (error) {
      setFundMessage(error?.response?.data?.message || 'Unable to start payment.');
      setFunding(false);
    }
  };

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
    <DashboardShell title="Ochi Wallet" subtitle="Fast access to your creator finance tools." showSearch={false} showBack backFallback="/home">
      <section className="space-y-6">
        <div className="bg-slate-950/30 p-0 sm:p-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Wallet workspace</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">Your money, clearly organised.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Fund your wallet securely, review every confirmed transaction, and get ready to support live comedians with gifts.</p>
            </div>
            <div className="text-left sm:text-right"><p className="text-xs uppercase tracking-[0.24em] text-slate-500">Available balance</p><p className="mt-1 text-3xl font-bold text-white">{loading ? '—' : `${summary.currency} ${(summary.availableBalance || 0).toLocaleString()}`}</p></div>
          </div>
        </div>

        <section className="bg-gradient-to-r from-rose-500/10 via-slate-950/70 to-amber-500/10 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-rose-300">Wallet funding</p>
              <h2 className="mt-2 text-xl font-bold text-white">Add funds to buy gifts</h2>
              <p className="mt-2 text-sm text-slate-400">Payments are securely handled by Paystack test mode.</p>
            </div>
            <button type="button" onClick={() => { setFundMessage(''); setShowFundingModal(true); }} className="rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_30px_-14px_rgba(244,63,94,0.9)] transition hover:bg-rose-400">Add funds</button>
          </div>
          {fundMessage ? <p className={`mt-3 text-sm ${fundMessage.includes('successfully') ? 'text-emerald-300' : 'text-rose-300'}`}>{fundMessage}</p> : null}
        </section>

        {showFundingModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="funding-title">
            <form onSubmit={handleAddFunds} className="w-full max-w-md bg-slate-900 p-5 shadow-2xl ring-1 ring-white/10 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-300">Secure checkout</p><h2 id="funding-title" className="mt-2 text-xl font-bold text-white">Add funds to your wallet</h2><p className="mt-2 text-sm leading-5 text-slate-400">Choose an amount. You will continue to Paystack to complete payment.</p></div>
                <button type="button" onClick={() => setShowFundingModal(false)} className="text-xl leading-none text-slate-500 hover:text-white" aria-label="Close add funds dialog">×</button>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[500, 1000, 5000].map((amount) => <button key={amount} type="button" onClick={() => setFundAmount(String(amount))} className={`border px-3 py-2 text-sm font-semibold transition ${fundAmount === String(amount) ? 'border-rose-300 bg-rose-500/15 text-white' : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}>{summary.currency} {amount.toLocaleString()}</button>)}
              </div>
              <label className="mt-4 block text-sm font-medium text-slate-300" htmlFor="wallet-fund-amount">Custom amount<input id="wallet-fund-amount" type="number" min="100" step="1" value={fundAmount} onChange={(event) => setFundAmount(event.target.value)} placeholder="100" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-rose-400" required /></label>
              {fundMessage ? <p className="mt-3 text-sm text-rose-300">{fundMessage}</p> : null}
              <div className="mt-5 flex gap-3"><button type="button" onClick={() => setShowFundingModal(false)} className="flex-1 rounded-lg border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white">Cancel</button><button type="submit" disabled={funding} className="flex-1 rounded-lg bg-rose-500 px-4 py-3 text-sm font-bold text-white hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60">{funding ? 'Opening Paystack...' : 'Continue to Paystack'}</button></div>
            </form>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border border-slate-800 bg-slate-900/60 p-4"><p className="text-sm font-semibold text-white">Buy gifts</p><p className="mt-1 text-xs leading-5 text-slate-500">Gift inventory will appear here when live tipping launches.</p><span className="mt-3 inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Coming soon</span></div>
          <div className="border border-slate-800 bg-slate-900/60 p-4"><p className="text-sm font-semibold text-white">Tip comedians</p><p className="mt-1 text-xs leading-5 text-slate-500">Use purchased gifts to support a comedian in a live room.</p><span className="mt-3 inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Coming soon</span></div>
          <div className="border border-slate-800 bg-slate-900/60 p-4"><p className="text-sm font-semibold text-white">Withdraw earnings</p><p className="mt-1 text-xs leading-5 text-slate-500">Creator payouts require a verified payout method and ledger.</p><span className="mt-3 inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">In setup</span></div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.85fr]">
          <div className="bg-slate-900/45 p-5">
            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Quick snapshot</p>
                <p className="mt-2 text-3xl font-semibold text-white">{loading ? 'Loading…' : `${summary.currency} ${summary.availableBalance?.toLocaleString() || '0'}`}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  A compact landing view with the most important wallet metrics.
                </p>
              </div>

              <div className="border-l border-slate-700/70 bg-slate-950/40 p-4 text-sm text-slate-300">
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

          <div className="page-section bg-slate-900/45 p-5">
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
