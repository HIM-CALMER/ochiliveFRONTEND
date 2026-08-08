import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BrandedLoader from '../components/BrandedLoader';
import screenLogo from '../assets/animations/screen.png';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const buildApiUrl = (path) => {
  const base = API_BASE_URL;
  return `${base}${base.endsWith('/api') ? '' : '/api'}${path}`;
};

const getErrorMessage = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || error?.response?.data?.error || error?.message;

  if (status === 404) {
    return 'The login endpoint could not be reached. Please make sure the backend server is running.';
  }

  if (message && message !== 'Network Error') {
    return message;
  }

  return 'Unable to sign in right now. Please check that the backend is running and try again.';
};

const persistSession = (token, user) => {
  sessionStorage.setItem('ochi_token', token);
  sessionStorage.setItem('ochi_user', JSON.stringify(user));
};

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(buildApiUrl('/auth/login'), form);
      persistSession(response.data.token, response.data.user);
      setMessage(response.data.message);
      setTransitioning(true);
      window.setTimeout(() => {
        navigate('/home');
      }, 1800);
    } catch (error) {
      setMessage(getErrorMessage(error));
      setLoading(false);
      window.setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--ochi-bg)] text-[var(--ochi-text)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.04),transparent_50%,rgba(244,63,94,0.08))]" />

      <Navbar />
      <BrandedLoader isVisible={transitioning} label="Opening your dashboard..." />

      <main className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-2 py-3 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid w-full gap-3 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <section className="order-1 rounded-[28px] border border-white/10 bg-slate-950/95 p-4 shadow-[0_32px_120px_-32px_rgba(2,6,23,0.95)] backdrop-blur-2xl transition duration-500 hover:shadow-[0_36px_130px_-24px_rgba(244,63,94,0.28)] sm:order-2 sm:rounded-[32px] sm:p-7 lg:p-10">
            <div className="mb-5 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
              <div className="flex items-center gap-3">
                <img src={screenLogo} alt="Ochi Live logo" className="h-10 w-10 rounded-lg object-cover shadow-lg shadow-rose-500/20 sm:h-12 sm:w-12" />
                <div>
                  <p className="text-base font-semibold text-white">Ochi Live</p>
                  <p className="text-sm text-slate-400">Live comedy, reimagined</p>
                </div>
              </div>
              <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 sm:inline-flex">
                Secure access
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-300 sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Backstage access
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-sm">Access account</p>
                <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Welcome back</h2>
              </div>
              <Link to="/signup" className="text-sm font-medium text-rose-300 transition hover:text-rose-200">
                Create account
              </Link>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in to continue your live experience with a secure, polished workspace designed for creators and audiences alike.
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {['Fast sign-in', 'Personalized rooms'].map((item) => (
                <div key={item} className="rounded-lg border border-slate-800/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3 sm:mt-8 sm:space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Email address
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3.5 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-rose-400 focus:bg-slate-950 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.16)] focus:ring-2 focus:ring-rose-500/20 sm:px-4 sm:py-3.5"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-300">
                Password
                <div className="relative mt-2">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3.5 py-3 pr-16 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-rose-400 focus:bg-slate-950 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.16)] focus:ring-2 focus:ring-rose-500/20 sm:px-4 sm:py-3.5"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-rose-300 transition hover:text-rose-200"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              <div className="flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-rose-500 focus:ring-rose-500/30" />
                  Remember me
                </label>
                <a href="#" className="text-rose-300 transition hover:text-rose-200">
                  Forgot password?
                </a>
              </div>

              {message ? (
                <div className={`rounded-lg border px-4 py-3 text-sm ${message.toLowerCase().includes('success') || message.toLowerCase().includes('successful') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">{message.toLowerCase().includes('success') || message.toLowerCase().includes('successful') ? 'âœ“' : '!'}</span>
                    <div>
                      <p>{message}</p>
                      {!message.toLowerCase().includes('success') && !message.toLowerCase().includes('successful') ? (
                        <p className="mt-1 text-xs text-rose-200/80">Please double-check your email and password, then try again.</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-[var(--ochi-accent)] px-5 py-3 text-sm font-semibold text-[var(--ochi-bg)] shadow-[0_12px_35px_-12px_rgba(244,63,94,0.6)] transition duration-300 hover:-translate-y-0.5 hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-70 sm:py-3.5"
              >
                {loading ? 'Signing in...' : 'Continue securely'}
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 sm:mt-6">
              <div className="h-px flex-1 bg-slate-950" />
              Or continue with
              <div className="h-px flex-1 bg-slate-950" />
            </div>

            <button className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-medium text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-slate-950/80 hover:text-white sm:mt-5">
              <span className="text-base">G</span>
              Continue with Google
            </button>

            <p className="mt-4 text-sm text-slate-400 sm:mt-6">
              New here?{' '}
              <Link className="font-medium text-rose-300 transition hover:text-rose-200" to="/signup">
                Create your account
              </Link>
            </p>
          </section>

          <section className="order-2 rounded-[28px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_28px_100px_-30px_rgba(244,63,94,0.35)] backdrop-blur-2xl transition duration-500 hover:shadow-[0_32px_110px_-24px_rgba(244,63,94,0.24)] sm:order-1 sm:rounded-[32px] sm:p-7 lg:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-300 sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Premium experience
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:mt-6 sm:text-4xl lg:text-5xl">
              Welcome back to the stage.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:mt-4 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              Step back into a refined space for live comedy, creator rooms, and memorable conversations.
            </p>

            <p className="mt-4 text-sm text-slate-300 sm:hidden">
              Jump back into live shows and creator rooms in seconds.
            </p>

            <div className="mt-4 hidden space-y-3 sm:mt-8 sm:block sm:space-y-4">
              {[
                'Secure sign-in with encrypted sessions',
                'Jump straight into live shows and creator rooms',
                'Personalized recommendations tailored to your taste',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-slate-800/70 bg-slate-950/65 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-4">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
                    âœ¦
                  </div>
                  <p className="text-sm leading-6 text-slate-300 sm:text-[15px] sm:leading-7">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;

