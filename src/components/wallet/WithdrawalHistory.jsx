export default function WithdrawalHistory({ history = [], currency, rate, loading = false }) {
  const formatMoney = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value * rate);

  return (
    <section className="border border-slate-800 bg-slate-950 p-5 rounded-none">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Withdrawal history</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Cash-out log</h2>
        </div>
        <p className="text-sm text-slate-400">Updated in real time</p>
      </div>

      <div className="mt-5 min-w-0">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-none bg-slate-900" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No withdrawals yet.</div>
        ) : (
          <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500">
              <th className="py-3 px-3">Ref</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Destination</th>
              <th className="py-3 px-3">Fees</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.reference} className="border-b border-slate-800 last:border-b-0">
                <td className="py-4 px-3 text-slate-300">{item.reference}</td>
                <td className="py-4 px-3 text-slate-300">{item.date}</td>
                <td className="py-4 px-3 text-slate-200">{formatMoney(item.amount)}</td>
                <td className="py-4 px-3 text-slate-400">{item.destination}</td>
                <td className="py-4 px-3 text-slate-300">{formatMoney(item.fees)}</td>
                <td className="py-4 px-3 text-slate-200 uppercase tracking-[0.18em]">{item.status}</td>
              </tr>
            ))}
          </tbody>
              </table>
            </div>

            <div className="sm:hidden space-y-3">
              {history.map((item) => (
                <div key={item.reference} className="border border-slate-800 bg-slate-900 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.reference}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.date} • {item.destination}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatMoney(item.amount)}</p>
                      <p className="mt-1 text-xs text-slate-300">{item.status}</p>
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
