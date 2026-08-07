export default function CreatorCard({ name, host, image, status = 'Live', viewers = '242K' }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-800/70 bg-gradient-to-br from-slate-900/60 to-slate-950/40">
      {/* Glow background on hover */}
      <div className="absolute -inset-px rounded-lg opacity-0 transition duration-300 group-hover:opacity-100 -z-10 blur-xl bg-gradient-to-r from-[var(--ochi-accent)]/20 to-transparent" />

      {/* Main Content Container */}
      <div className="relative aspect-[4/2] overflow-hidden bg-slate-950">
        {/* Creator Image */}
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

        {/* Live Badge - Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-rose-500/20 px-2.5 py-1 backdrop-blur-sm border border-rose-400/30">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
          </span>
          <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-widest">
            {status}
          </span>
        </div>

        {/* Viewers Count - Top Left */}
        <div className="absolute top-3 left-3 text-slate-300 text-[11px] font-semibold uppercase tracking-widest">
          {viewers} viewers
        </div>

        {/* Content Bottom */}
        <div className="absolute bottom-0 inset-x-0 p-4 space-y-1">
          {/* Event Category */}
          <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-[var(--ochi-accent)]">
            ROGUE & RAW
          </span>
          
          {/* Event Name */}
          <h3 className="text-lg font-bold text-white leading-tight">
            {name}
          </h3>
          
          {/* Host Info */}
          <p className="text-xs text-slate-300">
            Host: {host}
          </p>
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 pointer-events-none" />
    </div>
  );
}

