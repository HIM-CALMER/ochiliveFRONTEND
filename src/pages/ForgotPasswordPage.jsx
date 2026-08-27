import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const buildApiUrl = (path) => `${API_BASE_URL}${API_BASE_URL.endsWith('/api') ? '' : '/api'}${path}`;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(buildApiUrl('/auth/forgot-password'), form);
      setMessage(response.data.message);
      navigate('/reset-password', { state: { email: form.email.trim().toLowerCase(), username: form.username.trim().toLowerCase() } });
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to process your request right now.');
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
          <h1 className="mt-3 text-3xl font-semibold text-white">Reset your password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Enter the email and username for the account you want to recover.</p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block text-sm font-medium text-slate-300">
              Email address
              <input type="email" value={form.email} onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20" required />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Username
              <input value={form.username} onChange={(event) => setForm((previous) => ({ ...previous, username: event.target.value.toLowerCase().replace(/\s/g, '') }))} placeholder="your_creator_name" pattern="[a-z0-9_]{3,24}" className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-sm text-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20" required />
            </label>
            {message ? <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p> : null}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[var(--ochi-accent)] px-5 py-3.5 text-sm font-semibold text-[var(--ochi-bg)] transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Sending code...' : 'Send reset code'}
            </button>
          </form>
          <Link to="/login" className="mt-6 block text-center text-sm font-medium text-rose-300 hover:text-rose-200">Back to login</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ForgotPasswordPage;
