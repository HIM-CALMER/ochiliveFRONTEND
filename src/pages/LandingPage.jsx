import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import LandingAnimation from '../components/LandingAnimation';
import LandingSidebar from '../components/LandingSidebar';
import LiveActivityFeed from '../components/LiveActivityFeed';
import LiveChatPanel from '../components/LiveChatPanel';
import HeroPanel from '../components/HeroPanel';
import CreatorCard from '../components/CreatorCard';
import RotatingHeroText from '../components/RotatingHeroText';
import RotatingSubheading from '../components/RotatingSubheading';
import { AnimatedCounter, StatCounter } from '../components/AnimatedCounter';
import CinematicReel from '../components/CinematicReel';
import screenLogo from '../assets/animations/screen.png';

/* ------------------------------------------------------------------ */
/*  Ochi Live â€” Landing Page (v4, cinematic theatrical hero)          */
/*  Concept: The Global Stage for Live Comedy                         */
/*  Functionality preserved â€” only visuals & animations enhanced.     */
/*  Hero now plays a scripted overture:                               */
/*    0.0s  atmospheric darkness + drifting stage haze                */
/*    0.6s  golden/rose spotlight cone sweeps in from above           */
/*    1.2s  vignette lifts, hero copy rises line-by-line              */
/*    1.9s  CTA + supporting text settle, ambient shimmer begins      */
/*  Color tokens preserved: --ochi-bg, --ochi-text, --ochi-accent     */
/* ------------------------------------------------------------------ */

/* ------------------------------ Data ------------------------------ */

// Higher-fidelity, mood-consistent stage/spotlight imagery
const creatorShowcase = [
  {
    name: 'Weekend Special',
    host: 'Dave Chappelle & Friends',
    viewers: '242K',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=900&h=560&fit=crop&q=80',
    specialty: 'Stand-up',
  },
  {
    name: 'Midnight Sketches',
    host: 'Maya Patel',
    viewers: '156K',
    image: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=900&h=560&fit=crop&q=80',
    specialty: 'Sketch',
  },
  {
    name: 'Improv Madness',
    host: 'Jordan Lee',
    viewers: '89K',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=900&h=560&fit=crop&q=80',
    specialty: 'Improv',
  },
  {
    name: 'Lagos Vibes',
    host: 'Sophie Chen',
    viewers: '312K',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&h=560&fit=crop&q=80',
    specialty: 'Comedy',
  },
  {
    name: 'Tech Laughs',
    host: 'Marcus Brown',
    viewers: '128K',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&h=560&fit=crop&q=80',
    specialty: 'Tech Comedy',
  },
  {
    name: 'Stories & Laughter',
    host: 'Zara Khan',
    viewers: '194K',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=900&h=560&fit=crop&q=80',
    specialty: 'Storytelling',
  },
];

// Cinematic hero backdrop â€” spotlight cutting through a smoky theater
const HERO_BACKDROP =
  'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1800&h=1200&fit=crop&q=85';

const valueProps = [
  {
    audience: 'For Fans',
    title: 'Watch Live, Anywhere',
    text: 'Real-time performances from top comedians and rising stars. Feel the energy of a live audience, from your living room.',
    cta: 'Explore Shows',
  },
  {
    audience: 'For Creators',
    title: 'Perform. Grow. Earn.',
    text: 'Monetize your talent with ticketed shows, fan support, and creator tools built for comedians.',
    cta: 'Become a Creator',
  },
  {
    audience: 'For Everyone',
    title: 'Comedy Without Borders',
    text: 'Connect across Lagos, London, New York, and Tokyo. Language and distance are no longer barriers to laughter.',
    cta: 'See Global Schedule',
  },
];

const steps = [
  { n: '01', title: 'Discover', text: 'Browse live shows, clips, and creators tailored to your taste.' },
  { n: '02', title: 'Join', text: 'Tap to enter. React, comment, and send support in real time.' },
  { n: '03', title: 'Experience', text: 'Feel the connection. Laugh together with thousands around the world.' },
];

const creatorFeatures = [
  { title: 'Ticketed Shows', text: 'Sell tickets to exclusive live performances.' },
  { title: 'Fan Support', text: 'Receive tips, gifts, and subscriptions during shows.' },
  { title: 'Audience Analytics', text: 'Understand whoâ€™s watching and where theyâ€™re from.' },
  { title: 'Creator Dashboard', text: 'Manage shows, earnings, and community in one place.' },
];

const audienceFeatures = [
  { title: 'Live Reactions', text: 'Emoji reactions, live chat, and audience laughter meters.' },
  { title: 'Personalized Feed', text: 'AI recommendations based on your comedy taste.' },
  { title: 'Clips & Replays', text: 'Catch highlights if you miss the live show.' },
  { title: 'Multi-device', text: 'Watch on phone, tablet, or TV.' },
];

const globalStats = [
  { value: '50', label: 'Countries', suffix: '+' },
  { value: '20', label: 'Languages', suffix: '+' },
  { value: '1000000', label: 'Laughs per day', suffix: '+' },
];

const testimonials = [
  { quote: 'The audience interaction makes it feel like Iâ€™m actually in the room.', name: 'David K.', role: 'Viewer' },
  { quote: 'I made more in one month on Ochi than I did in 3 months touring.', name: 'Sarah L.', role: 'Creator' },
  { quote: 'Finally, a platform that treats comedy like a real profession.', name: 'Tunde A.', role: 'Producer' },
];

const trustLogos = ['VULTURE', 'THE FADER', 'COMPLEX', 'OKAYAFRICA', 'ROLLING STONE', 'PITCHFORK', 'BILLBOARD'];

const securityPoints = [
  'Encrypted payments and secure login',
  'Verified creators and content moderation',
  'HD streaming with low-latency technology',
  '24/7 creator and audience support',
];

const footerCols = [
  { title: 'Product', links: ['How it Works', 'For Creators', 'For Fans', 'Pricing'] },
  { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Contact'] },
  { title: 'Resources', links: ['Help Center', 'Community Guidelines', 'Blog'] },
  { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy'] },
];

/* --------------------------- Hooks --------------------------- */

// Reveal on scroll â€” respects prefers-reduced-motion, one-shot per element
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

const Reveal = ({ children, delay = 0, as: Tag = 'div', className = '' }) => {
  const { ref, shown } = useReveal();
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform-gpu transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[6px]'
      } ${className}`}
    >
      {children}
    </Tag>
  );
};

/* --------------------------- Primitives --------------------------- */

const Eyebrow = ({ children }) => (
  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ochi-accent)]">
    <span className="h-px w-6 bg-[var(--ochi-accent)]/60" />
    {children}
  </span>
);

// Card with cursor-tracked spotlight + subtle lift
const Panel = ({ children, className = '', interactive = true }) => {
  const ref = useRef(null);
  const handleMove = (e) => {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden rounded-lg border border-slate-800/70 bg-slate-950/95 backdrop-blur-sm transition-all duration-500 ${
        interactive ? 'hover:-translate-y-1 hover:border-slate-700 hover:shadow-[0_30px_80px_-30px_rgba(244,63,94,0.35)]' : ''
      } ${className}`}
    >
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(244,63,94,0.14), transparent 45%)',
          }}
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </div>
  );
};

const PrimaryBtn = ({ children, onClick }) => (
  <button onClick={onClick} className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--ochi-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--ochi-bg)] shadow-[0_10px_30px_-10px_rgba(244,63,94,0.55)] transition-all duration-300 hover:bg-rose-400 hover:shadow-[0_18px_50px_-12px_rgba(244,63,94,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ochi-bg)]">
    <span
      aria-hidden
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
    />
    <span className="relative">{children}</span>
    <span className="relative ml-2 transition-transform duration-300 group-hover:translate-x-1">â†’</span>
  </button>
);

const SecondaryBtn = ({ children, onClick }) => (
  <button onClick={onClick} className="inline-flex items-center justify-center rounded-full border border-slate-700 px-7 py-3.5 text-sm font-semibold text-[var(--ochi-text)] transition-all duration-300 hover:border-pink-400 hover:bg-slate-950/50 hover:text-pink-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/60">
    {children}
  </button>
);

const SectionHeader = ({ eyebrow, title, sub }) => (
  <Reveal className="mx-auto max-w-3xl text-center">
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--ochi-text)] sm:text-5xl">
      {title}
    </h2>
    {sub && <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">{sub}</p>}
  </Reveal>
);

/* --------------------------- Ambient Motion --------------------------- */
const animationStyles = `
  /* Ambient */
  @keyframes floatOrb  { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(0,-24px,0) scale(1.05); } }
  @keyframes drift     { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(20px,-14px,0); } }
  @keyframes pulseDot  { 0%,100% { box-shadow: 0 0 0 0 rgba(244,63,94,0.55); } 50% { box-shadow: 0 0 0 14px rgba(244,63,94,0); } }
  @keyframes shimmer   { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes marquee   { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes tickerY   { from { transform: translateY(0); } to { transform: translateY(-50%); } }
  @keyframes gridPan   { from { background-position: 0 0; } to { background-position: 88px 88px; } }

  /* Theatrical hero overture */
  @keyframes vignetteLift { 0% { opacity: 1; } 100% { opacity: 0.55; } }
  @keyframes hazeDrift    { 0% { transform: translate3d(-4%, 2%, 0) scale(1.08); opacity: 0; }
                            25% { opacity: 0.55; }
                            100% { transform: translate3d(6%, -3%, 0) scale(1.14); opacity: 0.45; } }
  @keyframes hazeDriftB   { 0% { transform: translate3d(6%, 4%, 0) scale(1.1); opacity: 0; }
                            30% { opacity: 0.4; }
                            100% { transform: translate3d(-5%, -2%, 0) scale(1.18); opacity: 0.3; } }
  @keyframes spotConeIn   { 0% { opacity: 0; transform: translateX(-50%) rotate(-14deg) scaleY(0.4); filter: blur(28px); }
                            55% { opacity: 0.9; filter: blur(14px); }
                            100% { opacity: 0.75; transform: translateX(-50%) rotate(-6deg) scaleY(1); filter: blur(18px); } }
  @keyframes spotSway     { 0%,100% { transform: translateX(-50%) rotate(-6deg) scaleY(1); }
                            50%    { transform: translateX(-48%) rotate(-3deg) scaleY(1.02); } }
  @keyframes goldPulse    { 0%,100% { opacity: 0.55; transform: scale(1); }
                            50%    { opacity: 0.85; transform: scale(1.06); } }
  @keyframes stageFloorIn { 0% { opacity: 0; transform: translateY(30px) scaleX(0.6); }
                            100% { opacity: 0.8; transform: translateY(0) scaleX(1); } }
  @keyframes dustFloat    { 0% { transform: translate3d(0,0,0); opacity: 0; }
                            10% { opacity: 0.7; }
                            100% { transform: translate3d(var(--dx,20px), var(--dy,-140px), 0); opacity: 0; } }
  @keyframes heroRise     { 0% { opacity: 0; transform: translateY(28px); filter: blur(10px); letter-spacing: 0.02em; }
                            100% { opacity: 1; transform: translateY(0); filter: blur(0); letter-spacing: 0; } }
  @keyframes velvetRise   { 0% { opacity: 0; transform: translateY(14px); }
                            100% { opacity: 1; transform: translateY(0); } }
  @keyframes curtainAway  { 0% { transform: translateY(0); opacity: 0.85; }
                            100% { transform: translateY(-40%); opacity: 0; } }

  /* Ambient classes */
  .orb          { animation: floatOrb 14s ease-in-out infinite; }
  .orb-slow     { animation: drift 22s ease-in-out infinite; }
  .pulse-dot    { animation: pulseDot 2.4s ease-out infinite; }
  .grid-pan     { animation: gridPan 24s linear infinite; }
  .marquee-track{ animation: marquee 32s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }
  .ticker-track { animation: tickerY 16s linear infinite; }

  /* Hero stage classes */
  .stage-haze-a  { animation: hazeDrift 22s ease-in-out 0.1s infinite alternate; }
  .stage-haze-b  { animation: hazeDriftB 26s ease-in-out 0.4s infinite alternate; }
  .stage-cone    { transform-origin: 50% 0%; opacity: 0;
                   animation: spotConeIn 2200ms cubic-bezier(0.19,1,0.22,1) 500ms forwards,
                              spotSway 9s ease-in-out 2800ms infinite; }
  .stage-gold    { opacity: 0; animation: goldPulse 6s ease-in-out 1400ms infinite,
                              velvetRise 1400ms ease-out 900ms forwards; }
  .stage-floor   { opacity: 0; animation: stageFloorIn 1600ms cubic-bezier(0.22,1,0.36,1) 800ms forwards; }
  .stage-vignette{ animation: vignetteLift 2400ms ease-out 600ms forwards; }
  .stage-curtain { animation: curtainAway 2200ms cubic-bezier(0.7,0,0.2,1) 300ms forwards; }
  .hero-rise     { opacity: 0; animation: heroRise 1400ms cubic-bezier(0.22,1,0.36,1) forwards; }
  .velvet-rise   { opacity: 0; animation: velvetRise 1100ms cubic-bezier(0.22,1,0.36,1) forwards; }
  .stage-dust    { animation: dustFloat 9s linear infinite; }

  .shimmer-text {
    background: linear-gradient(90deg, rgba(244,63,94,0) 0%, rgba(244,63,94,0.9) 20%, #fff 50%, rgba(244,63,94,0.9) 80%, rgba(244,63,94,0) 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 6s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .orb, .orb-slow, .pulse-dot, .grid-pan, .marquee-track, .ticker-track, .shimmer-text,
    .stage-haze-a, .stage-haze-b, .stage-cone, .stage-gold, .stage-floor, .stage-vignette,
    .stage-curtain, .hero-rise, .velvet-rise, .stage-dust { animation: none !important; opacity: 1 !important; transform: none !important; }
  }
`;

/* ---------------------------- Page ---------------------------- */

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--ochi-bg)] text-[var(--ochi-text)] antialiased">
      <style>{animationStyles}</style>

      {/* Ambient background: drifting rose orbs + faint grid */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.18),transparent_60%)] blur-3xl orb" />
        <div className="absolute right-[-160px] top-[40%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.14),transparent_60%)] blur-3xl orb-slow" />
        <div className="absolute bottom-[-160px] left-[30%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.10),transparent_60%)] blur-3xl orb" />
        <div className="absolute inset-0 opacity-[0.05] grid-pan bg-[linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <LandingSidebar />

      {/* ============ HEADER ============ */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-900/80 bg-[var(--ochi-bg)]/70 backdrop-blur-xl md:sticky">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={screenLogo}
                alt="Ochi Live"
                className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-lg object-cover shadow-xl shadow-[var(--ochi-accent)]/35"
              />
            </div>
            <a href="/" aria-label="Ochi Live home" className="text-lg font-semibold tracking-tight">
              ochi<span className="text-[var(--ochi-accent)]">.</span>live
            </a>
          </div>
          <nav aria-label="Primary" className="hidden gap-8 text-sm text-slate-400 md:flex">
            {[
              ['How it works', '#how'],
              ['For creators', '#creators'],
              ['For fans', '#fans'],
              ['Community', '#community'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="group relative transition hover:text-pink-300"
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-pink-300 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="hidden text-sm text-slate-300 transition hover:text-pink-300 sm:inline">Sign in</button>
            <PrimaryBtn onClick={() => navigate('/signup')}>Get Started</PrimaryBtn>
          </div>
        </div>
      </header>

      <main className="pt-20 md:pt-0">
        {/* ============ LIVE ACTIVITY FEED ============ */}
        <LiveActivityFeed />

        {/* ============ HERO â€” Cinematic Overture ============ */}
        <section aria-labelledby="hero-title" className="relative overflow-hidden isolate">
          {/* Layer 1 â€” deep atmospheric backdrop (always present) */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <img
              src={HERO_BACKDROP}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-[0.22] [filter:contrast(1.05)_saturate(1.1)]"
              loading="eager"
            />
            {/* Deep base wash */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--ochi-bg)] via-[var(--ochi-bg)]/70 to-[var(--ochi-bg)]" />
            {/* Warm golden pool from above â€” theatrical wash light */}
            <div className="absolute inset-0 stage-gold bg-[radial-gradient(ellipse_60%_45%_at_50%_-6%,rgba(255,196,120,0.22),transparent_65%)]" />
            {/* Rose halo */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,63,94,0.22),_transparent_60%)]" />
          </div>

          {/* Layer 2 â€” drifting stage haze (two parallax bands) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="stage-haze-a absolute -inset-[10%] bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,220,170,0.10),transparent_55%),radial-gradient(ellipse_at_80%_60%,rgba(244,63,94,0.10),transparent_55%)] blur-3xl" />
            <div className="stage-haze-b absolute -inset-[15%] bg-[radial-gradient(ellipse_at_60%_20%,rgba(255,180,140,0.08),transparent_55%),radial-gradient(ellipse_at_30%_80%,rgba(236,72,153,0.09),transparent_55%)] blur-3xl" />
          </div>

          {/* Layer 3 â€” spotlight cone from top-center */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="stage-cone absolute left-1/2 top-[-8%] h-[130%] w-[70%]"
              style={{
                background:
                  'conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(255,214,150,0.22) 6deg, rgba(255,196,120,0.32) 12deg, rgba(244,63,94,0.14) 20deg, transparent 34deg)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.85) 40%, transparent 92%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.85) 40%, transparent 92%)',
              }}
            />
            {/* Warm hotspot where cone meets stage */}
            <div className="stage-floor absolute left-1/2 top-[52%] h-40 w-[55%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(255,196,120,0.35),rgba(244,63,94,0.12)_45%,transparent_70%)] blur-2xl" />
          </div>

          {/* Layer 4 â€” floating dust motes drifting through the cone */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {[
              { l: '46%', t: '78%', d: '3s', dx: '18px',  dy: '-260px' },
              { l: '52%', t: '82%', d: '5s', dx: '-14px', dy: '-300px' },
              { l: '49%', t: '70%', d: '7s', dx: '22px',  dy: '-220px' },
              { l: '55%', t: '86%', d: '9s', dx: '-24px', dy: '-340px' },
              { l: '44%', t: '74%', d: '11s', dx: '10px', dy: '-280px' },
              { l: '58%', t: '76%', d: '13s', dx: '-8px', dy: '-320px' },
            ].map((p, i) => (
              <span
                key={i}
                className="stage-dust absolute h-[3px] w-[3px] rounded-full bg-amber-100/70 shadow-[0_0_8px_rgba(255,214,150,0.7)]"
                style={{ left: p.l, top: p.t, animationDelay: p.d, '--dx': p.dx, '--dy': p.dy }}
              />
            ))}
          </div>

          {/* Layer 5 â€” opening vignette (dark curtain that lifts) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 stage-vignette bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.75)_85%)]" />
          {/* Top velvet curtain edge â€” rises away */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 stage-curtain bg-gradient-to-b from-black via-black/70 to-transparent" />

          <div className="relative mx-auto grid max-w-[1200px] gap-16 px-6 py-24 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:py-32">
            <div className="flex flex-col justify-center">
              {/* Live badge removed per request */}

              <div className="hero-rise mt-5" style={{ animationDelay: '1500ms' }}>
                <Eyebrow>The Global Stage for Live Comedy</Eyebrow>
              </div>

              <div className="hero-rise" style={{ animationDelay: '1700ms' }}>
                <RotatingHeroText />
              </div>
              <div className="hero-rise" style={{ animationDelay: '1950ms' }}>
                <RotatingSubheading />
              </div>

              <div
                className="velvet-rise mt-10 flex flex-wrap items-center gap-4"
                style={{ animationDelay: '2200ms' }}
              >
                <PrimaryBtn onClick={() => navigate('/signup')}>Get Started</PrimaryBtn>
                <SecondaryBtn onClick={() => navigate('/login')}>Sign In</SecondaryBtn>
              </div>

              <p
                className="velvet-rise mt-6 text-sm text-slate-500"
                style={{ animationDelay: '2400ms' }}
              >
                Join <span className="text-slate-300">500K+ viewers</span> and{' '}
                <span className="text-slate-300">10,000+ creators</span> worldwide.
              </p>
              <p
                className="velvet-rise mt-2 text-xs text-slate-600"
                style={{ animationDelay: '2550ms' }}
              >
                No downloads required. Start in under 60 seconds.
              </p>
            </div>

            {/* Hero visual â€” enters with warm rim-light glow */}
            <div className="hero-rise relative" style={{ animationDelay: '1800ms' }}>
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-md bg-gradient-to-br from-amber-300/15 via-rose-500/20 to-pink-500/10 blur-2xl"
              />
              <div
                aria-hidden
                className="absolute -inset-px -z-10 rounded-md bg-gradient-to-b from-amber-200/20 via-transparent to-transparent"
              />
              <HeroPanel />
            </div>
          </div>
        </section>


        {/* ============ VALUE PROPOSITION ============ */}
        <section aria-labelledby="value-title" className="relative border-t border-slate-900/80">
          <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-28">
            <SectionHeader
              eyebrow="Why Ochi Live"
              title="Live comedy, reimagined."
              sub="One platform for the people watching, the people performing, and the people finding each other in between."
            />
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {valueProps.map((v, i) => (
                <Reveal key={v.audience} delay={i * 120}>
                  <Panel className="flex h-full flex-col p-8">
                    <Eyebrow>{v.audience}</Eyebrow>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">{v.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-400">{v.text}</p>
                    <a
                      href="#"
                      className="group/link mt-8 inline-flex items-center text-sm font-semibold text-pink-300 transition hover:text-rose-300"
                    >
                      {v.cta}
                      <span className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1">â†’</span>
                    </a>
                  </Panel>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CREATORS SHOWCASE ============ */}
        <section aria-labelledby="creators-live" className="border-t border-slate-900/80">
          <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-28">
            <SectionHeader
              eyebrow="Real-time creators"
              title="Comedy is happening now."
              sub="Join thousands of live performances across the globe. From intimate studios to packed virtual rooms."
            />
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {creatorShowcase.map((creator, idx) => (
                <Reveal key={creator.name} delay={(idx % 3) * 120}>
                  <CreatorCard
                    name={creator.name}
                    host={creator.host}
                    image={creator.image}
                    viewers={creator.viewers}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section id="how" aria-labelledby="how-title" className="border-t border-slate-900/80">
          <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-28">
            <SectionHeader eyebrow="How it works" title="Get in the room in 3 steps." />
            <ol className="relative mt-16 grid gap-6 md:grid-cols-3">
              {/* Connecting line on desktop */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-rose-500/40 to-transparent md:block"
              />
              {steps.map((s, i) => (
                <Reveal key={s.n} as="li" delay={i * 140}>
                  <Panel className="h-full p-8">
                    <div className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-md border border-rose-500/30 bg-rose-500/10 text-sm font-semibold text-rose-200">
                        {s.n}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Step
                      </span>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.text}</p>
                  </Panel>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ FOR CREATORS ============ */}
        <section id="creators" aria-labelledby="creators-title" className="border-t border-slate-900/80">
          <div className="mx-auto grid max-w-[1200px] gap-16 px-6 py-24 sm:py-28 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <Eyebrow>For Creators</Eyebrow>
              <h2 id="creators-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Built for comedians. <br />
                <span className="italic text-[var(--ochi-accent)]">Designed for growth.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400">
                Ochi Live gives you the tools to build a sustainable comedy career â€” without middlemen.
              </p>
              <blockquote className="mt-10 rounded-r-xl border-l-2 border-[var(--ochi-accent)] bg-slate-950/95 py-4 pl-5 pr-4 text-slate-300 backdrop-blur-sm">
                <p className="text-lg italic leading-relaxed">
                  â€œOchi Live helped me sell out my first virtual tour and connect with fans in 12 countries.â€
                </p>
                <footer className="mt-3 text-sm text-slate-500">â€” Amina B., Stand-up Comedian</footer>
              </blockquote>
              <div className="mt-10">
                <PrimaryBtn onClick={() => navigate('/signup')}>Start Performing</PrimaryBtn>
              </div>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2">
              {creatorFeatures.map((f, i) => (
                <Reveal key={f.title} delay={i * 100}>
                  <Panel className="p-6">
                    <h3 className="text-base font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
                  </Panel>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FOR AUDIENCES ============ */}
        <section id="fans" aria-labelledby="fans-title" className="border-t border-slate-900/80">
          <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-28">
            <SectionHeader
              eyebrow="For Audiences"
              title="Never miss a moment of laughter."
              sub="From 2am sets in New York to primetime shows in Lagos â€” comedy happens 24/7."
            />
            <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {audienceFeatures.map((f, i) => (
                <Reveal key={f.title} as="li" delay={i * 100}>
                  <Panel className="h-full p-6">
                    <h3 className="text-base font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
                  </Panel>
                </Reveal>
              ))}
            </ul>
              <div className="mt-14 flex justify-center">
              <PrimaryBtn onClick={() => navigate('/shows')}>Browse Live Now</PrimaryBtn>
            </div>
          </div>
        </section>

        {/* ============ GLOBAL COMMUNITY ============ */}
        <section id="community" aria-labelledby="community-title" className="border-t border-slate-900/80">
          <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-28">
            <SectionHeader
              eyebrow="Global community"
              title="One stage. Every culture."
              sub="Comedy is universal. Ochi Live brings together diverse voices, accents, and perspectives on a single platform."
            />

            <Reveal>
              <Panel interactive={false} className="mt-14 overflow-hidden p-0">
                  <div className="relative">
                    {/* Cinematic micro-reel: Lottie/video preview with reduced-motion fallback */}
                    <CinematicReel />
                  </div>
                  {[
                    { top: '38%', left: '20%', label: 'Lagos' },
                    { top: '30%', left: '48%', label: 'London' },
                    { top: '36%', left: '30%', label: 'NYC' },
                    { top: '42%', left: '78%', label: 'Tokyo' },
                    { top: '58%', left: '58%', label: 'Mumbai' },
                  ].map((d) => (
                    <div key={d.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: d.top, left: d.left }}>
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--ochi-accent)] shadow-[0_0_18px_rgba(244,63,94,0.7)]" />
                      </span>
                      <span className="ml-4 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                        {d.label}
                      </span>
                    </div>
                  ))}
              </Panel>
            </Reveal>

            <dl className="mt-10 grid gap-8 sm:grid-cols-3">
              {/* Qualitative badges replacing numeric counters */}
              {[
                {
                  id: 'global-stage',
                  title: 'Global Stage',
                  text: 'Creators & fans across the world',
                  svg: (
                    <svg className="h-9 w-9 text-rose-300" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 12h20M12 2c2.5 3 4 7 4 10s-1.5 7-4 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  id: 'multilingual',
                  title: 'Multilingual',
                  text: 'Shows in many languages',
                  svg: (
                    <svg className="h-9 w-9 text-rose-300" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  id: 'always-live',
                  title: 'Always Live',
                  text: 'Comedy happening 24/7',
                  svg: (
                    <svg className="h-9 w-9 text-rose-300" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
              ].map((b, i) => (
                <Reveal key={b.id} delay={i * 120}>
                  <div role="group" aria-labelledby={b.id} className="transform-gpu transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none translate-y-0 opacity-100 blur-0" style={{ transitionDelay: `${i * 120}ms` }}>
                    <dt id={b.id} className="sr-only">{b.title}</dt>
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-slate-950/95 shadow-sm">{b.svg}</div>
                      <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--ochi-accent)] via-rose-300 to-[var(--ochi-accent)]">{b.title}</h3>
                      <p className="mt-3 text-sm text-slate-400 font-medium">{b.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* ============ SOCIAL PROOF ============ */}
        <section aria-labelledby="proof-title" className="border-t border-slate-900/80">
          <div className="mx-auto max-w-[1200px] px-6 py-24 sm:py-28">
            <SectionHeader eyebrow="Social proof" title="Trusted by comedians and fans worldwide." />

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 140}>
                  <Panel className="flex h-full flex-col p-8">
                    <div className="flex items-center gap-1 text-rose-300" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <svg key={k} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-4 flex-1 text-base leading-relaxed text-slate-300">â€œ{t.quote}â€</p>
                    <footer className="mt-6 flex items-center gap-3 text-sm text-slate-500">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose-500/40 to-pink-500/20 text-xs font-semibold text-rose-100">
                        {t.name.split(' ').map((s) => s[0]).join('')}
                      </span>
                      <span>
                        <span className="text-slate-300">{t.name}</span> â€” {t.role}
                      </span>
                    </footer>
                  </Panel>
                </Reveal>
              ))}
            </div>

            {/* Featured-in marquee */}
            <div className="mt-16 border-t border-slate-900 pt-10">
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                Featured in
              </p>
              <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
                <ul className="marquee-track flex w-max gap-14 whitespace-nowrap text-slate-500">
                  {[...trustLogos, ...trustLogos].map((l, i) => (
                    <li
                      key={`${l}-${i}`}
                      className="text-sm font-semibold tracking-[0.2em] transition hover:text-slate-200"
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SECURITY & QUALITY ============ */}
        <section aria-labelledby="security-title" className="border-t border-slate-900/80">
          <div className="mx-auto grid max-w-[1200px] gap-16 px-6 py-24 sm:py-28 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Security & quality</Eyebrow>
              <h2 id="security-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Premium experience. <br />
                <span className="italic text-[var(--ochi-accent)]">Secure platform.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">
                We take your experience and data seriously â€” from the first tap to the final bow.
              </p>
            </Reveal>
            <ul className="grid gap-4 self-center">
              {securityPoints.map((p, i) => (
                <Reveal key={p} as="li" delay={i * 90}>
                  <div className="flex items-start gap-4 border-b border-slate-900 pb-4 transition-colors duration-300 hover:border-rose-500/30">
                    <span className="mt-1.5 grid h-6 w-6 flex-none place-items-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="text-base text-slate-300">{p}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section aria-labelledby="cta-title" className="border-t border-slate-900/80">
          <div className="mx-auto max-w-[1200px] px-6 py-28">
            <Reveal>
              <Panel interactive={false} className="relative overflow-hidden p-12 text-center sm:p-20">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.22),transparent_65%)]"
                />
                <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl orb" />
                <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl orb-slow" />
                <div className="relative">
                  <Eyebrow>Your seat is waiting</Eyebrow>
                  <h2 id="cta-title" className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
                    Come for the laughs. <br />
                    <span className="italic shimmer-text">Stay for the stage.</span>
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400">
                    Join the worldâ€™s fastest-growing community for live comedy â€” whether youâ€™re here to laugh or to perform.
                  </p>
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <PrimaryBtn onClick={() => navigate('/signup')}>Create Free Account</PrimaryBtn>
                    <SecondaryBtn onClick={() => navigate('/login')}>Sign In</SecondaryBtn>
                  </div>
                  <p className="mt-6 text-xs text-slate-600">Free to join. No credit card required.</p>
                </div>
              </Panel>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-slate-900/80">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div>
              <a href="/" className="text-lg font-semibold tracking-tight">
                ochi<span className="text-[var(--ochi-accent)]">.</span>live
              </a>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
                The global stage for live comedy. Watch, perform, and connect â€” anywhere in the world.
              </p>
              <ul className="mt-6 flex gap-5 text-sm text-slate-500">
                {['Instagram', 'X', 'TikTok', 'YouTube'].map((s) => (
                  <li key={s}>
                    <a href="#" className="transition hover:text-pink-300">{s}</a>
                  </li>
                ))}
              </ul>
            </div>
            {footerCols.map((col) => (
              <div key={col.title}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-300">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="transition hover:text-pink-300">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-slate-900 pt-8 text-xs text-slate-600 sm:flex-row sm:items-center">
            <span>Â© 2026 Ochi Live, Inc. All rights reserved.</span>
            <span>Made for the global stage.</span>
          </div>
        </div>
        <Footer />
      </footer>
    </div>
  );
}


