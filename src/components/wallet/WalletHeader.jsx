export default function WalletHeader({ currency, conversionRate }) {
  return (
    <section className="border border-slate-800 bg-slate-950 p-5 rounded-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Ochi Wallet</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Creator finance overview</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            A professional wallet experience with transparent settlement, payout history, and multi-currency controls.
          </p>
        </div>
        <div className="w-full max-w-full border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200">
          <p className="uppercase tracking-[0.25em] text-slate-500">Base currency</p>
          <p className="mt-2 text-lg font-semibold text-white">{currency}</p>
          <p className="mt-1 text-xs text-slate-400">Exchange rate shown: 1 USD = {conversionRate} {currency}</p>
        </div>
      </div>
    </section>
  );
}
