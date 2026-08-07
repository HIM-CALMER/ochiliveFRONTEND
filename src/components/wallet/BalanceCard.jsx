export default function BalanceCard({ label, amount, currencySymbol = '$', detail, accentText = 'text-slate-400', loading = false }) {
  const showValue = typeof amount === 'number' && !isNaN(amount);

  return (
    <section className="bg-slate-950 border border-slate-800 p-5 rounded-none">
      <p className={`text-[11px] uppercase tracking-[0.32em] ${accentText}`}>{label}</p>
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-32 animate-pulse bg-slate-800" />
        ) : showValue ? (
          <p className="text-3xl font-semibold tracking-tight text-white">{currencySymbol}{amount.toLocaleString()}</p>
        ) : (
          <p className="text-2xl font-semibold tracking-tight text-slate-400">—</p>
        )}
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p> : null}
    </section>
  );
}
