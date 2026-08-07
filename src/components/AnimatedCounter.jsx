import { useEffect, useRef, useState } from 'react';

export function AnimatedCounter({ end, duration = 2000, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(entry.target);

          let startTime = null;
          const targetNum = parseInt(end.toString().replace(/\D/g, ''));

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOut = (t) => 1 - Math.pow(1 - t, 3);
            const current = Math.floor(easeOut(progress) * targetNum);

            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration, hasStarted]);

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div
      ref={ref}
      className="text-center"
    >
      <div className="text-5xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--ochi-accent)] via-rose-300 to-[var(--ochi-accent)]">
        {formatNumber(count)}<span className="text-3xl sm:text-4xl">{suffix}</span>
      </div>
      <p className="mt-3 text-sm text-slate-400 font-medium">{label}</p>
    </div>
  );
}

export function StatCounter({ value, label, suffix = '' }) {
  return (
    <div className="border-t border-slate-800 pt-6 animate-stagger">
      <dt className="text-sm text-slate-500 font-medium">{label}</dt>
      <dd className="mt-3">
        <AnimatedCounter end={value} duration={2000} label="" suffix={suffix} />
      </dd>
    </div>
  );
}
