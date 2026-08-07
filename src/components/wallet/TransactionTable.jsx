export default function TransactionTable({ transactions = [], currency, rate, loading = false }) {
  const formatMoney = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value * rate);

  const statusStyles = {
    settled: 'text-emerald-300 bg-emerald-500/10',
    pending: 'text-amber-300 bg-amber-500/10',
    failed: 'text-rose-300 bg-rose-500/10',
  };

  return (
    <section className="border border-slate-800 bg-slate-950 p-5 rounded-none">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Recent transactions</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Live activity ledger</h2>
        </div>
        <p className="text-sm text-slate-400">Showing latest 8 items</p>
      </div>

      <div className="mt-5 min-w-0">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-none bg-slate-900" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No transactions to show yet.</div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500">
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Event</th>
              <th className="py-3 px-3">Source</th>
              <th className="py-3 px-3">Gross</th>
              <th className="py-3 px-3">Fee</th>
              <th className="py-3 px-3">Net</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-slate-800 last:border-b-0">
                <td className="py-4 px-3 text-slate-300">{transaction.date}</td>
                <td className="py-4 px-3 text-slate-200">{transaction.event}</td>
                <td className="py-4 px-3 text-slate-400">{transaction.source}</td>
                <td className="py-4 px-3 text-slate-200">{formatMoney(transaction.gross)}</td>
                <td className="py-4 px-3 text-slate-300">{formatMoney(transaction.commission)}</td>
                <td className="py-4 px-3 text-slate-200">{formatMoney(transaction.net)}</td>
                <td className="py-4 px-3">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${statusStyles[transaction.status] || statusStyles.pending}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
              </table>
            </div>

            {/* Mobile stacked list */}
            <div className="sm:hidden space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="border border-slate-800 bg-slate-900 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{transaction.event}</p>
                      <p className="mt-1 text-xs text-slate-400">{transaction.date} • {transaction.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatMoney(transaction.net)}</p>
                      <p className="mt-1 text-xs text-slate-300">{transaction.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
