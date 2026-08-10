import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getWalletSummary } from '../../api/dashboardApi';

function WalletLink() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    getWalletSummary().then((summary) => setBalance(summary.balance)).catch(() => {});
  }, []);

  return (
    <Link to="/wallet" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white">
      <span className="inline-flex h-8 w-8 items-center justify-center border border-slate-700 text-emerald-300 transition-colors group-hover:border-emerald-300/60" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4"><path d="M4 7.5h15a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" /><path d="M5 7.5V6a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M15 13h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </span>
      {balance === null ? 'Wallet' : `Wallet ${balance.toLocaleString()}`}
      <span aria-hidden="true" className="text-slate-500 transition-transform group-hover:translate-x-0.5">-&gt;</span>
    </Link>
  );
}

export default WalletLink;