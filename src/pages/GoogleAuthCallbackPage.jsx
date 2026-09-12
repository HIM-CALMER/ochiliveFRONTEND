import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { persistSession } from '../utils/session';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const buildApiUrl = (path) => `${API_BASE_URL}${API_BASE_URL.endsWith('/api') ? '' : '/api'}${path}`;

function GoogleAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Completing Google sign-in...');

  useEffect(() => {
    let active = true;
    const exchange = async () => {
      const code = searchParams.get('code');
      if (!code) {
        if (active) {
          setMessage('Google sign-in could not be completed.');
          window.setTimeout(() => navigate('/login'), 1200);
        }
        return;
      }

      try {
        const response = await axios.post(buildApiUrl('/auth/google/exchange'), { code });
        persistSession(response.data.token, response.data.user);
        navigate('/home', { replace: true });
      } catch (error) {
        if (!active) return;
        setMessage(error?.response?.data?.message || 'Google sign-in could not be completed.');
        window.setTimeout(() => navigate('/login'), 1600);
      }
    };

    exchange();
    return () => {
      active = false;
    };
  }, [navigate, searchParams]);

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--ochi-bg)] px-6 text-center text-white">
      <div className="max-w-sm rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-rose-400" />
        <p className="mt-5 text-sm text-slate-300">{message}</p>
      </div>
    </main>
  );
}

export default GoogleAuthCallbackPage;
