export const getStoredSession = () => {
  if (typeof window === 'undefined') {
    return { token: '', user: null };
  }

  const token = localStorage.getItem('ochi_token') || sessionStorage.getItem('ochi_token') || '';
  const rawUser = localStorage.getItem('ochi_user') || sessionStorage.getItem('ochi_user') || 'null';

  try {
    return { token, user: rawUser ? JSON.parse(rawUser) : null };
  } catch {
    return { token, user: null };
  }
};

export const persistSession = (token, user) => {
  if (typeof window === 'undefined') return;

  if (token) {
    localStorage.setItem('ochi_token', token);
    sessionStorage.setItem('ochi_token', token);
  }

  if (user) {
    const payload = JSON.stringify(user);
    localStorage.setItem('ochi_user', payload);
    sessionStorage.setItem('ochi_user', payload);
  }
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('ochi_token');
  localStorage.removeItem('ochi_user');
  sessionStorage.removeItem('ochi_token');
  sessionStorage.removeItem('ochi_user');
};

export const isAuthenticated = () => Boolean(getStoredSession().token);
