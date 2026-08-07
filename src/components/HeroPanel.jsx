import { useEffect, useState } from 'react';
import LiveChatPanel from './LiveChatPanel';

export default function HeroPanel() {
  const [viewers, setViewers] = useState(24200);
  const [displayViewers, setDisplayViewers] = useState(24200);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate growing viewership
  useEffect(() => {
    const increment = setInterval(() => {
      setViewers((prev) => {
        const newVal = prev + Math.floor(Math.random() * 50) + 10;
        return newVal;
      });
    }, 1500);

    return () => clearInterval(increment);
  }, []);

  // Smooth counter animation
  useEffect(() => {
    if (displayViewers !== viewers) {
      const diff = viewers - displayViewers;
      const step = Math.ceil(diff / 8);
      const timer = setTimeout(() => {
        setDisplayViewers((prev) => prev + step);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [viewers, displayViewers]);

  return (
    <div className="relative group">
      {/* Outer Glow Background */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[24px] bg-[radial-gradient(circle_at_30%_20%,_rgba(244,63,94,0.25),_transparent_60%)] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      />

      {/* Main Panel - 16:9 Widescreen Cinema Ratio */}
      <div className="relative aspect-video overflow-hidden rounded-[24px] border border-slate-800/50 shadow-2xl shadow-[var(--ochi-accent)]/15 hover:shadow-[var(--ochi-accent)]/30 transition-all duration-500 bg-slate-950 group/panel">
        {/* Background Layer */}
        {!isMobile ? (
          // Desktop: Image + Gradient Overlay
          <>
            <img
              src="https://images.unsplash.com/photo-1514306688772-e0083a07c7f3?w=1200&h=675&fit=crop&q=80"
              alt="Live Performance"
              className="absolute inset-0 h-full w-full object-cover group-hover/panel:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            {/* Multi-layer Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          </>
        ) : (
          // Mobile: Animated Gradient Mesh
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ochi-accent)]/10 via-transparent to-transparent" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 50%, rgba(244,63,94,0.15) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(244,63,94,0.1) 0%, transparent 50%)
                `,
                animation: 'gradientShift 15s ease-in-out infinite',
              }}
            />
          </>
        )}

        {/* Content Container */}
        <div className="relative h-full flex items-stretch z-10">
          {/* Left Section - Text Content */}
          <div className="w-full sm:w-1/2 md:w-1/2 lg:w-[60%] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
            {/* Top Section - Badges */}
            <div className="space-y-3">
              {/* Animated LIVE Badge */}
              <div className="inline-flex items-center gap-2 w-fit">
                <div className="relative">
                  {/* Outer Glow */}
                  <div className="absolute -inset-2 rounded-full bg-rose-500/30 blur-xl animate-pulse opacity-75" />
                  
                  {/* Badge */}
                  <div className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500/40 to-red-600/30 backdrop-blur-md px-3.5 py-2 border border-rose-400/40 shadow-lg shadow-rose-500/20">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-200" />
                    </span>
                    <span className="text-xs font-bold text-rose-100 uppercase tracking-widest">
                      Live Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="inline-block">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--ochi-accent)] bg-[var(--ochi-accent)]/20 px-3.5 py-1.5 rounded-full border border-[var(--ochi-accent)]/40 backdrop-blur-sm">
                  ROGUE & RAW
                </span>
              </div>
            </div>

            {/* Middle Section - Main Content */}
            <div className="space-y-2">
              {/* Event Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg">
                Weekend
                <br />
                Special
              </h2>

              {/* Host Info */}
              <p className="text-sm sm:text-base text-slate-100 font-semibold drop-shadow-md flex items-center gap-2">
                <span className="text-lg">ðŸŽ¤</span>
                Dave Chappelle & Friends
              </p>
            </div>

            {/* Bottom Section - CTA */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[var(--ochi-accent)] to-rose-500 text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:shadow-[var(--ochi-accent)]/50 hover:scale-105 active:scale-95 transform">
                Watch Now
              </button>
              <span className="hidden sm:inline text-xs text-slate-300">
                No payment required â€¢ Start free
              </span>
            </div>
          </div>

          {/* Right Section - Chat Panel */}
          <div className="hidden sm:flex md:flex lg:flex w-full md:w-1/2 lg:w-[40%] border-l border-slate-800/30 overflow-hidden">
            <LiveChatPanel />
          </div>
        </div>

        {/* Floating Badge - Engagement Indicator */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
          <div className="text-xs font-bold text-rose-300 bg-rose-500/20 px-3 py-1.5 rounded-full border border-rose-400/30 backdrop-blur-sm flex items-center gap-1.5 animate-pulse">
            <span>âœ¨</span>
            Trending Now
          </div>
        </div>

        {/* Animated Viewer Counter - New Position (Mobile Visible) */}
        <div className="absolute top-6 right-6 lg:hidden z-20">
          <div className="flex items-center gap-2 rounded-full bg-slate-950/70 backdrop-blur-md px-3.5 py-2 border border-slate-700/50">
            <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100 tabular-nums">
              {(displayViewers / 1000).toFixed(1)}K
            </span>
          </div>
        </div>

        {/* Desktop Viewer Counter */}
        <div className="hidden lg:block absolute top-8 right-8 z-20">
          <div className="flex items-center gap-2 rounded-full bg-slate-950/60 backdrop-blur-md px-5 py-3 border border-slate-700/50 group-hover:border-[var(--ochi-accent)]/30 transition-colors duration-300 shadow-lg shadow-black/20">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-sm font-bold text-slate-100 tabular-nums">
              {(displayViewers / 1000).toFixed(1)}K
            </span>
            <span className="text-xs text-slate-400 ml-1">watching</span>
          </div>
        </div>
      </div>

      {/* Bottom Glow Shadow */}
      <div className="absolute -bottom-4 inset-x-0 h-8 rounded-full bg-[var(--ochi-accent)]/8 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            backgroundPosition: 0% 50%;
          }
          50% {
            backgroundPosition: 100% 50%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        div[style*="gradientShift"] {
          backgroundSize: 200% 200%;
        }
      `}</style>
    </div>
  );
}


