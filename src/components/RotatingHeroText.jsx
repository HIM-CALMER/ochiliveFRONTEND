import { useEffect, useState } from 'react';

const heroVariants = [
  'live comedy',
  'bold creators',
  'real moments',
  'unlimited audiences',
  'authentic talent',
];

export default function RotatingHeroText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroVariants.length);
        setIsTransitioning(false);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1
      id="hero-title"
      className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[76px]"
    >
      The global stage for{' '}
      <span
        className={`italic text-transparent bg-clip-text bg-gradient-to-r from-[var(--ochi-accent)] via-rose-300 to-[var(--ochi-accent)] inline-block transition-all duration-400 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {heroVariants[currentIndex]}
      </span>
      .
    </h1>
  );
}
