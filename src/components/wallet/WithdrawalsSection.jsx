const withdrawalSteps = [
  { step: 1, title: 'Select account', detail: 'Choose bank transfer or saved payout method.' },
  { step: 2, title: 'Enter amount', detail: 'Review balances and conversion before you continue.' },
  { step: 3, title: 'Review', detail: 'Confirm settlement, fees, and security checks.' },
  { step: 4, title: 'Confirm', detail: 'Finalize the withdrawal and receive instant status.' },
];

const methods = [
  { label: 'Bank transfer', status: 'Available now', hint: 'NGN, USD, EUR, GBP' },
  { label: 'Cards & wallets', status: 'Coming soon', hint: 'Visa, Mastercard, PayPal' },
];

const requirements = [
  'Verified identity on file',
  'Minimum withdrawal threshold met',
  'Automated fraud & risk review',
];

export default function WithdrawalsSection({ balance, currency, loading = false }) {
  return (
    <section className="border border-slate-800 bg-slate-950 p-5 rounded-none">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Withdrawal flow</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Secure payout experience</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Available balance for withdrawal</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {currency}{typeof balance === 'number' && !isNaN(balance) ? balance.toLocaleString() : '--'}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 grid-cols-1 lg:grid-cols-2">
        <div className="border border-slate-800 bg-slate-900 p-4 rounded-none">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Payout requirements</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {requirements.map((item) => (
              <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 bg-rose-500" />
                  <span>{item}</span>
                </li>
            ))}
          </ul>
        </div>

        <div className="border border-slate-800 bg-slate-900 p-4 rounded-none">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Supported methods</p>
          <div className="mt-4 space-y-3">
            {methods.map((method) => (
              <div key={method.label} className="border border-slate-800 bg-slate-950 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{method.label}</p>
                  <span className="text-xs uppercase tracking-[0.32em] text-slate-400">{method.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{method.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!loading && (
        <div className="mt-5 border border-slate-800 bg-slate-900 p-4 rounded-none">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Process steps</p>
          <div className="mt-4 space-y-3">
            {withdrawalSteps.map((item) => (
              <div key={item.step} className="flex items-start gap-3 border-b border-slate-800 pb-3 last:border-b-0 last:pb-0">
                <div className="flex h-9 w-9 items-center justify-center bg-slate-950 text-sm font-semibold text-white">{item.step}</div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
