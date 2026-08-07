import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLottie } from "lottie-react";
import animationData from "../assets/animations/streaming-animation.json";

function LandingAnimation() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(true);

  const options = {
    animationData,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const { View } = useLottie(options);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/30">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4">
          <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
            Live now
          </span>
          <span className="rounded-full bg-slate-950/95 px-3 py-1 text-xs font-semibold text-white">
            24.2K viewers
          </span>
        </div>

        <div className="aspect-[4/2] bg-slate-950">{View}</div>

        <div className="absolute inset-x-0 bottom-0 z-10 rounded-b-[2rem] bg-gradient-to-t from-slate-950/95 via-slate-950/10 to-transparent p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Rogue & Raw</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Weekend Special</h2>
          <p className="mt-2 text-sm text-slate-300">Host: Dave Chappelle & Friends</p>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live Global Chat</p>
            <p className="mt-1 text-xs text-slate-500">Stay connected to fans around the world.</p>
          </div>
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-300">
          <div className="rounded-md bg-slate-950/80 p-4">
            <p className="font-semibold">comedy_fan_89</p>
            <p className="mt-1 text-slate-500">LMAO no way he said that no cap</p>
          </div>
          <div className="rounded-md bg-slate-950/80 p-4">
            <p className="font-semibold">standup_queen</p>
            <p className="mt-1 text-slate-500">NYC crowd is always the best</p>
          </div>
          <div className="rounded-md bg-slate-950/80 p-4">
            <p className="font-semibold">mod_ochi</p>
            <p className="mt-1 text-slate-500">VIP after-party starts in 20 mins! Get your passes ready.</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/signup')}
            className="flex-1 rounded-full bg-[var(--ochi-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
          >
            Join Now
          </button>
          <button
            onClick={() => navigate('/')}
            aria-label="Skip"
            className="rounded-full bg-white/6 px-3 py-1 text-sm font-medium text-white hover:bg-white/10"
          >
            Skip
          </button>
        </div>
      </aside>
    </div>
  );
}

export default LandingAnimation;


