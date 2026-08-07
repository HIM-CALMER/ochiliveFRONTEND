import { useEffect, useState } from 'react';

const subheadingVariants = [
  {
    hero: 'live comedy',
    text: 'Join real-time performances from legendary comedians and rising stars. Watch from anywhere, anytime.',
  },
  {
    hero: 'bold creators',
    text: 'Monetize your talent. Get paid for tickets, tips, and subscriptions. Build a sustainable comedy career on your terms.',
  },
  {
    hero: 'real moments',
    text: 'Live means unfiltered and unscripted. Feel the energy of a real audience, together with thousands worldwide.',
  },
  {
    hero: 'unlimited audiences',
    text: 'Perform in front of global audiences. From Lagos to London to Tokyo. Your comedy has no borders.',
  },
  {
    hero: 'authentic talent',
    text: 'We celebrate real talent, not algorithms. Quality performances, verified creators, and genuine connections.',
  },
];

export default function RotatingSubheading() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % subheadingVariants.length);
        setIsTransitioning(false);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className={`mt-7 max-w-xl text-lg leading-relaxed text-slate-400 transition-all duration-400 ${
        isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      {subheadingVariants[currentIndex].text}
    </p>
  );
}
