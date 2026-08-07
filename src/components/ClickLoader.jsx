import { useEffect, useRef, useState } from 'react';
import screenLogo from '../assets/animations/screen.png';

export default function ClickLoader() {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      const element = event.target.closest('a[href], button, [data-click-loader]');
      if (!element) return;
      if (element.tagName === 'A' && element.getAttribute('href')?.startsWith('#')) return;

      setVisible(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setVisible(false), 2200);
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 backdrop-blur-sm">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-950/90 shadow-[0_0_50px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 rounded-full border border-[var(--ochi-accent)]/20 opacity-70 blur-sm animate-pulse" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[var(--ochi-accent)] border-r-slate-500 animate-spin" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-950/95 shadow-[0_0_28px_rgba(56,189,248,0.3)] animate-[pulse_1.8s_ease-in-out_infinite]">
          <img
            src={screenLogo}
            alt="Ochi Live logo"
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
