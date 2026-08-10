import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BrandedLoader from '../components/BrandedLoader';
import screenLogo from '../assets/animations/screen.png';

const AuthSparkIcon = ({ className = 'text-rose-300' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="4" strokeWidth="2.2" fill="currentColor" fillOpacity="0.06" />
  </svg>
);

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const buildApiUrl = (path) => {
  const base = API_BASE_URL;
  return `${base}${base.endsWith('/api') ? '' : '/api'}${path}`;
};

const getErrorMessage = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || error?.response?.data?.error || error?.message;

  if (status === 404) {
    return 'The signup endpoint could not be reached. Please make sure the backend server is running.';
  }

  if (status === 409) {
    return 'That email or username is already in use.';
  }

  if (message && message !== 'Network Error') {
    return message;
  }

  return 'Unable to create your account right now. Please check that the backend is running and try again.';
};

const persistSession = (token, user) => {
  sessionStorage.setItem('ochi_token', token);
  sessionStorage.setItem('ochi_user', JSON.stringify(user));
};

const getPasswordStrength = (password) => {
  const checks = [
    { label: '8+ characters', passed: password.length >= 8 },
    { label: 'lowercase', passed: /[a-z]/.test(password) },
    { label: 'uppercase', passed: /[A-Z]/.test(password) },
    { label: 'number', passed: /\d/.test(password) },
    { label: 'symbol', passed: /[^A-Za-z0-9]/.test(password) },
  ];

  const passedCount = checks.filter((item) => item.passed).length;
  const score = password ? Math.round((passedCount / checks.length) * 100) : 0;

  if (!password) {
    return { score, label: 'Use 8+ characters, plus uppercase, lowercase, a number, and a symbol.', barClass: 'bg-slate-950', textClass: 'text-slate-400' };
  }

  if (score < 40) {
    return { score, label: 'Needs more strength', barClass: 'bg-rose-500', textClass: 'text-rose-300' };
  }

  if (score < 80) {
    return { score, label: 'Good password', barClass: 'bg-amber-500', textClass: 'text-amber-300' };
  }

  return { score, label: 'Strong password', barClass: 'bg-emerald-500', textClass: 'text-emerald-300' };
};

function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(buildApiUrl('/auth/register'), form);
      setPendingEmail(response.data.email || form.email);
      setMessage(response.data.message || 'Verification code sent.');
      setLoading(false);
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message;

      if (status === 500 && message && message.includes('verification email')) {
        setPendingEmail(form.email);
        setMessage('Signup is ready, but email delivery is unavailable right now. Please use the code section below if you receive a manual code or try again shortly.');
      } else {
        setMessage(getErrorMessage(error));
      }

      setLoading(false);
      window.setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(buildApiUrl('/auth/verify'), { email: pendingEmail, otp: otpCode });
      persistSession(response.data.token, response.data.user);
      setMessage(response.data.message);
      setTransitioning(true);
      window.setTimeout(() => {
        navigate('/home');
      }, 1800);
    } catch (error) {
      setMessage(getErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--ochi-bg)] text-[var(--ochi-text)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.04),transparent_50%,rgba(244,63,94,0.08))]" />

      <Navbar />
      <BrandedLoader isVisible={transitioning} label="Creating your account..." />

      <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-2.5 py-2.5 sm:px-6 sm:py-5 lg:px-8 lg:py-8">
        <div className="grid w-full gap-3 sm:gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <section className="order-1 rounded-[30px] border-[2.5px] border-white/10 bg-slate-950/90 p-4 shadow-[0_24px_90px_-34px_rgba(2,6,23,0.95)] backdrop-blur-2xl sm:order-2 sm:rounded-[34px] sm:p-7 lg:p-10">
            <div className="mb-3 flex items-center justify-between rounded-2xl border-[2.5px] border-white/10 bg-white/[0.04] px-3 py-2 sm:px-4 sm:py-2.5">
              <div className="flex items-center gap-3">
                <img src={screenLogo} alt="Ochi Live logo" className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-rose-500/20 sm:h-12 sm:w-12" />
                <div>
                  <p className="text-base font-semibold text-white">Ochi Live</p>
                  <p className="text-sm text-slate-400">Create your stage</p>
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-slate-400">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-500/10 text-rose-300 shadow-sm shadow-rose-500/10">
                  <AuthSparkIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-sm">Create account</p>
                  <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">Start your Ochi journey</h2>
                </div>
              </div>
              <Link to="/login" className="text-sm font-medium text-rose-300 transition hover:text-rose-200">
                Sign in instead
              </Link>
            </div>

            <p className="mt-2 text-sm leading-5 text-slate-400">
              Fast sign-up with short, secure steps.
            </p>

            <form onSubmit={pendingEmail ? handleOtpSubmit : handleSubmit} className="mt-3 space-y-2.5 sm:mt-5 sm:space-y-3">
              {pendingEmail ? (
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-slate-200">
                  <p className="font-medium text-white">Verification step</p>
                  <p className="mt-1 text-slate-300">Use the 6-digit code for <span className="font-medium text-rose-300">{pendingEmail}</span>.</p>
                  <p className="mt-1 text-xs text-slate-400">A verification code will be sent to this email address.</p>
                </div>
              ) : null}

              {!pendingEmail ? (
                <>
                  <label className="block text-sm font-medium text-slate-300">
                    Username
                    <input
                      name="username"
                      type="text"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="your_creator_name"
                      pattern="[a-z0-9_]{3,24}"
                      className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
                      required
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-300">
                    Email address
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
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
                        placeholder="Create a secure password"
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
                    <div className="mt-3 space-y-2">
                      <div className="h-2 overflow-hidden rounded-full bg-slate-950">
                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.barClass}`} style={{ width: `${passwordStrength.score}%` }} />
                      </div>
                      <p className={`text-[11px] sm:text-xs ${passwordStrength.textClass}`}>{passwordStrength.label}</p>
                    </div>
                  </label>
                </>
              ) : (
                <label className="block text-sm font-medium text-slate-300">
                  Verification code
                  <input
                    name="otp"
                    type="text"
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value)}
                    placeholder="Enter the 6-digit code"
                    className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </label>
              )}

              {message ? (
                <div className={`rounded-lg border px-4 py-3 text-sm ${message.toLowerCase().includes('success') || message.toLowerCase().includes('successful') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">{message.toLowerCase().includes('success') || message.toLowerCase().includes('successful') ? 'âœ“' : '!'}</span>
                    <div>
                      <p>{message}</p>
                      {!message.toLowerCase().includes('success') && !message.toLowerCase().includes('successful') ? (
                        <p className="mt-1 text-xs text-rose-200/80">Please review your details and try again in a moment.</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {pendingEmail ? (
                <button
                  type="button"
                  onClick={() => {
                    setPendingEmail('');
                    setOtpCode('');
                    setMessage('');
                  }}
                  className="text-sm font-medium text-slate-400 transition hover:text-slate-200"
                >
                  Use a different email
                </button>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-[var(--ochi-accent)] px-5 py-3 text-sm font-semibold text-[var(--ochi-bg)] shadow-[0_12px_35px_-12px_rgba(244,63,94,0.6)] transition duration-300 hover:-translate-y-0.5 hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-70 sm:py-3.5"
              >
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-rose-300">
                  <AuthSparkIcon className="h-4 w-4" />
                </span>
                {loading ? (pendingEmail ? 'Verifying code...' : 'Creating account...') : pendingEmail ? 'Verify & continue' : 'Create account'}
              </button>
            </form>

            <div className="mt-3 flex items-center gap-3 text-sm text-slate-500 sm:mt-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-slate-400">Other options</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <button className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border-[2.5px] border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-medium text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-slate-950/80 hover:text-white sm:mt-5">
              <span className="text-base">G</span>
              Google sign-up
            </button>

            <p className="mt-4 text-sm text-slate-400 sm:mt-6">
              Already have an account?{' '}
              <Link className="font-medium text-rose-300 transition hover:text-rose-200" to="/login">
                Log in here
              </Link>
            </p>
          </section>

          <section className="order-2 rounded-[28px] border-[2.5px] border-white/10 bg-slate-950/60 p-4 shadow-[0_28px_100px_-30px_rgba(244,63,94,0.35)] backdrop-blur-2xl transition duration-500 hover:shadow-[0_32px_110px_-24px_rgba(244,63,94,0.24)] sm:order-1 sm:rounded-[32px] sm:p-7 lg:p-10">
            <div className="flex items-center gap-3 text-slate-400">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-500/10 text-rose-300 shadow-sm shadow-rose-500/10">
                <AuthSparkIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-300 sm:text-[11px]">
                  Creator-ready
                </p>
                <p className="mt-1 text-sm text-slate-400">Quick, polished onboarding.</p>
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:mt-6 sm:text-4xl lg:text-5xl">
              Join the next generation of live entertainment.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-5 text-slate-300 sm:mt-4">
              Fast onboarding for creators and fans.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                'Creator rooms',
                'Live chat',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border-[2.5px] border-slate-800/70 bg-slate-950/65 p-3.5">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
                    ◆
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
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

export default SignUpPage;

