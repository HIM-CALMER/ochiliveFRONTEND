import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const buildApiUrl = (path) => {
  const base = API_BASE_URL;
  return `${base}${base.endsWith('/api') ? '' : '/api'}${path}`;
};

const api = axios.create({
  baseURL: buildApiUrl('/dashboard'),
  headers: { 'Content-Type': 'application/json' },
});

const videoApi = axios.create({
  baseURL: buildApiUrl('/videos'),
  headers: { 'Content-Type': 'application/json' },
});

const authInterceptor = (config) => {
  const token = sessionStorage.getItem('ochi_token');
  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem('ochi_user') || 'null');
  } catch {
    sessionStorage.removeItem('ochi_user');
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (user?.id) config.headers['X-Ochi-User-ID'] = user.id;
  if (user?.email) config.headers['X-Ochi-User-Email'] = user.email;
  return config;
};

api.interceptors.request.use(authInterceptor);
videoApi.interceptors.request.use(authInterceptor);

export const getDashboardSummary = async () => {
  const { data } = await api.get('/summary');
  return data;
};

export const getVideoFeed = async () => {
  const { data } = await videoApi.get('/');
  return data;
};

export const incrementView = async (id) => {
  const { data } = await videoApi.post(`/${id}/view`);
  return data;
};

export const likeVideo = async (id) => {
  const { data } = await videoApi.post(`/${id}/like`);
  return data;
};

export const commentOnVideo = async (id, comment) => {
  const { data } = await videoApi.post(`/${id}/comments`, { comment });
  return data;
};

export const toggleSaveVideo = async (id) => {
  const { data } = await videoApi.post(`/${id}/save`);
  return data;
};

export const getSavedVideos = async () => {
  const { data } = await videoApi.get('/saved');
  return data;
};

export const uploadVideoPost = async (payload) => {
  const { data } = await videoApi.post('/upload', payload);
  return data;
};

export const getDiscoverItems = async () => {
  const { data } = await api.get('/discover');
  return data;
};

export const getWalletSummary = async () => {
  const { data } = await api.get('/wallet');
  return data;
};

export const getProfileSummary = async (username) => {
  const user = JSON.parse(sessionStorage.getItem('ochi_user') || 'null');
  const target = username || user?.username || user?.email?.split('@')[0] || 'creator';
  const { data } = await api.get(`/../profiles/${target}`);
  return data;
};

export const getProfilePosts = async (username) => {
  const { data } = await api.get(`/../profiles/${username}/posts`);
  return data;
};

export const getProfileReshares = async (username) => {
  const { data } = await api.get(`/../profiles/${username}/reshares`);
  return data;
};

export const followProfile = async (username) => {
  const { data } = await api.post(`/../profiles/${username}/follow`);
  return data;
};

export const unfollowProfile = async (username) => {
  const { data } = await api.delete(`/../profiles/${username}/follow`);
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch('/../profile/me', payload);
  return data;
};

export const updateProfilePicture = async (file) => {
  const form = new FormData();
  form.append('picture', file);
  const { data } = await api.post('/../profile/me/picture', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
};

export const getNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data;
};

export const getActivityFeed = async () => {
  const { data } = await api.get('/activity');
  return data;
};

export const uploadAsset = async (payload) => {
  const { data } = await api.post('/upload', payload);
  return data;
};
