const currencies = ['USD', 'EUR', 'GBP', 'NGN'];

export default function CurrencySwitcher({ value, onChange }) {
  return (
    <div className="border border-slate-800 bg-slate-950 p-2 text-sm text-slate-300 rounded-none">
      <div className="flex items-stretch gap-px">
        {currencies.map((currency) => (
          <button
            key={currency}
            type="button"
            onClick={() => onChange(currency)}
            className={`flex-1 border border-slate-800 bg-slate-950 px-3 py-2 text-center transition ${
              value === currency ? 'bg-slate-800 text-white' : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            {currency}
          </button>
        ))}
      </div>
    </div>
  );
}
