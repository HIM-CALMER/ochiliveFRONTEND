import { useOutletContext } from 'react-router-dom';
import WalletNav from '../../components/wallet/WalletNav';

export default function WalletLanding() {
  const { wallet, loading, currency } = useOutletContext();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
      <div className="border border-slate-800 bg-slate-950 p-5">
        <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Wallet hub</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Compact section launcher</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Start in a focused wallet landing page and jump directly into the section you need without scrolling through a single massive workspace.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Ready balance</p>
            <p className="mt-3 text-2xl font-semibold text-white">{loading ? '—' : `${currency} ${wallet.availableBalance?.toLocaleString() || '0'}`}</p>
          </div>
          <div className="border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pending settlement</p>
            <p className="mt-3 text-2xl font-semibold text-white">{loading ? '—' : `${currency} ${wallet.pendingBalance?.toLocaleString() || '0'}`}</p>
          </div>
          <div className="border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Lifetime earnings</p>
            <p className="mt-3 text-2xl font-semibold text-white">{loading ? '—' : `${currency} ${wallet.lifetimeEarnings?.toLocaleString() || '0'}`}</p>
          </div>
          <div className="border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Withdrawals</p>
            <p className="mt-3 text-2xl font-semibold text-white">{loading ? '—' : `${currency} ${wallet.totalWithdrawn?.toLocaleString() || '0'}`}</p>
          </div>
        </div>
      </div>

      <div className="border border-slate-800 bg-slate-900 p-5">
        <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Navigate wallet pages</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Choose a dedicated page</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Each page is designed to keep the workflow clean and focused: overview, revenue, transactions, and withdrawals.
        </p>
        <div className="mt-6">
          <WalletNav
            routes={[
              { label: 'Overview', to: '/wallet/overview' },
              { label: 'Revenue', to: '/wallet/revenue' },
              { label: 'Transactions', to: '/wallet/transactions' },
              { label: 'Withdrawals', to: '/wallet/withdrawals' },
            ]}
            summary={wallet || { currency }}
          />
        </div>
      </div>
    </div>
  );
}
