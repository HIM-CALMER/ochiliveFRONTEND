import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const buildApiUrl = (path) => `${API_BASE_URL}${API_BASE_URL.endsWith('/api') ? '' : '/api'}${path}`;

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: location.state?.email || '', username: location.state?.username || '', code: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!resendCooldown) return undefined;
    const timer = window.setInterval(() => setResendCooldown((previous) => Math.max(0, previous - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const resendCode = async () => {
    if (resendCooldown || !form.email || !form.username) return;
    setMessage('');
    try {
      await axios.post(buildApiUrl('/auth/forgot-password'), { email: form.email, username: form.username });
      setResendCooldown(60);
      setMessage('If those details match an account, a new code has been sent.');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to resend the code right now.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(buildApiUrl('/auth/reset-password'), { email: form.email, username: form.username, code: form.code, password: form.password });
      setMessage(response.data.message);
      window.setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to reset your password right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--ochi-bg)] text-[var(--ochi-text)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_24%)]" />
      <Navbar />
      <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center px-4 py-8 sm:px-6">
        <section className="w-full rounded-[30px] border-[2.5px] border-white/10 bg-slate-950/90 p-6 shadow-[0_24px_90px_-34px_rgba(2,6,23,0.95)] backdrop-blur-2xl sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">Account recovery</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Create a new password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Enter the six-digit code sent for @{form.username}, then choose a strong new password.</p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block text-sm font-medium text-slate-300">Email address<input name="email" type="email" value={form.email} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20" required /></label>
            <label className="block text-sm font-medium text-slate-300">Username<input name="username" value={form.username} onChange={handleChange} pattern="[a-z0-9_]{3,24}" className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20" required /></label>
            <label className="block text-sm font-medium text-slate-300">Reset code<input name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={form.code} onChange={handleChange} placeholder="123456" className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20" required /></label>
            <label className="block text-sm font-medium text-slate-300">New password<input name="password" type="password" value={form.password} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20" required /></label>
            <label className="block text-sm font-medium text-slate-300">Confirm new password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20" required /></label>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              {[['8+ characters', form.password.length >= 8], ['Uppercase letter', /[A-Z]/.test(form.password)], ['Lowercase letter', /[a-z]/.test(form.password)], ['Number', /\d/.test(form.password)], ['Symbol', /[^A-Za-z0-9]/.test(form.password)]].map(([label, passed]) => <span key={label} className={passed ? 'text-emerald-300' : ''}>{passed ? '✓' : '○'} {label}</span>)}
            </div>
            {message ? <p className={`rounded-lg border px-4 py-3 text-sm ${message.includes('updated') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>{message}</p> : null}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[var(--ochi-accent)] px-5 py-3.5 text-sm font-semibold text-[var(--ochi-bg)] transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-70">{loading ? 'Updating password...' : 'Update password'}</button>
          </form>
          <button type="button" onClick={resendCode} disabled={Boolean(resendCooldown)} className="mt-4 block w-full text-center text-sm font-medium text-rose-300 disabled:cursor-not-allowed disabled:text-slate-500">{resendCooldown ? `Resend code in ${resendCooldown}s` : 'Resend code'}</button>
          <Link to="/login" className="mt-6 block text-center text-sm font-medium text-rose-300 hover:text-rose-200">Back to login</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ResetPasswordPage;
