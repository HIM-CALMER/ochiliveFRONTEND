import React from 'react';

export default function SponsoredBanner({ image, ctaText = 'LEARN MORE', onClick }) {
  return (
    <section className="mb-6 w-full">
      <div className="relative w-full overflow-hidden rounded-2xl bg-slate-800">
        <img src={image} alt="sponsored" className="w-full object-cover h-44 sm:h-56 md:h-64" />

        {/* Sponsored badge top-right */}
        <div className="absolute right-3 top-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">SPONSORED</div>

        {/* subtle overlay to improve CTA legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* centered small CTA pill */}
        <div className="absolute left-1/2 bottom-4 -translate-x-1/2">
          <button
            onClick={onClick}
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md backdrop-blur"
          >
            {ctaText}
          </button>
        </div>
      </div>
    </section>
  );
}
