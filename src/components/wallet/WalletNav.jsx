import { NavLink } from 'react-router-dom';

const sectionMeta = {
  '/wallet/overview': { subtitle: 'Account snapshot', metricKey: 'availableBalance', icon: 'speedometer-outline' },
  '/wallet/revenue': { subtitle: 'Revenue breakdown', metricKey: 'lifetimeEarnings', icon: 'trending-up-outline' },
  '/wallet/transactions': { subtitle: 'Latest ledger', metricKey: 'recentTransactions', icon: 'list-outline' },
  '/wallet/withdrawals': { subtitle: 'Cash-out status', metricKey: 'totalWithdrawn', icon: 'wallet-outline' },
};

const symbolForCurrency = (currency) => {
  switch (currency) {
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'NGN':
      return '₦';
    default:
      return '$';
  }
};

export default function WalletNav({ routes, summary }) {
  const currencySymbol = symbolForCurrency(summary.currency);

    return (
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {routes.map((route) => {
          const meta = sectionMeta[route.to] || {};
          const value = summary[meta.metricKey];
          const textValue = route.to === '/wallet/transactions'
            ? `${(summary.recentTransactions || []).length} items`
            : typeof value === 'number'
            ? `${currencySymbol}${value.toLocaleString()}`
            : '—';

          return (
            <NavLink
              key={route.to}
              to={route.to}
              end={route.to === '/wallet/overview'}
              className={({ isActive }) =>
                `page-card group block overflow-hidden border border-slate-800 bg-slate-950 p-4 text-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900 ${
                  isActive ? 'shadow-[0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-amber-400/20' : ''
                }`
              }
            >
              <div className="flex items-start gap-3">
                <ion-icon name={meta.icon} className="text-amber-300 text-2xl sm:text-xl" />
                <div className="min-w-0">
                  <p className="uppercase tracking-[0.24em] text-slate-500">{route.label}</p>
                  <p className="mt-1 text-base sm:text-lg font-semibold text-white">{textValue}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400 hidden sm:block">{meta.subtitle}</p>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    );
}
