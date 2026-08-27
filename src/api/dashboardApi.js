import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const API_ROOT = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_ROOT,
  headers: { 'Content-Type': 'application/json' },
});

const videoApi = axios.create({
  baseURL: API_ROOT,
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
  const { data } = await api.get('/dashboard/summary');
  return data;
};

export const getVideoFeed = async (mode = 'for_you') => {
  const { data } = await videoApi.get('/videos/', { params: { mode } });
  return data;
};

export const incrementView = async (id) => {
  const { data } = await videoApi.post(`/videos/${id}/view`);
  return data;
};

export const likeVideo = async (id) => {
  const { data } = await videoApi.post(`/videos/${id}/like`);
  return data;
};

export const reshareVideo = async (id) => {
  const { data } = await videoApi.post(`/videos/${id}/reshare`);
  return data;
};

export const commentOnVideo = async (id, comment) => {
  const { data } = await videoApi.post(`/videos/${id}/comments`, { comment });
  return data;
};

export const toggleSaveVideo = async (id) => {
  const { data } = await videoApi.post(`/videos/${id}/save`);
  return data;
};

export const getSavedVideos = async () => {
  const { data } = await videoApi.get('/videos/saved');
  return data;
};

export const uploadVideoPost = async (payload) => {
  const { data } = await videoApi.post('/videos/upload', payload);
  return data;
};

export const uploadVideoFile = async (form) => {
  const { data } = await videoApi.post('/videos/upload-file', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
};

export const getDiscoverItems = async () => {
  const { data } = await api.get('/dashboard/discover');
  return data;
};

export const getWalletSummary = async () => {
  const { data } = await api.get('/dashboard/wallet');
  return data;
};

export const getProfileSummary = async (username) => {
  const user = JSON.parse(sessionStorage.getItem('ochi_user') || 'null');
  const target = username || user?.username || user?.email?.split('@')[0] || 'creator';
  const { data } = await api.get(`/profiles/${encodeURIComponent(target)}`);
  return data;
};

export const searchProfiles = async (query) => {
  const cleaned = String(query || '').trim();
  if (!cleaned) return { query: cleaned, results: [] };
  const { data } = await api.get('/search/profiles', { params: { q: cleaned } });
  return data;
};

export const getProfilePosts = async (username) => {
  const { data } = await api.get(`/profiles/${encodeURIComponent(username)}/posts`);
  return data;
};

export const getProfileReshares = async (username) => {
  const { data } = await api.get(`/profiles/${encodeURIComponent(username)}/reshares`);
  return data;
};

export const followProfile = async (username) => {
  const { data } = await api.post(`/profiles/${encodeURIComponent(username)}/follow`);
  return data;
};

export const unfollowProfile = async (username) => {
  const { data } = await api.delete(`/profiles/${encodeURIComponent(username)}/follow`);
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch('/profile/me', payload);
  return data;
};

export const updateProfilePicture = async (file) => {
  const form = new FormData();
  form.append('picture', file);
  const { data } = await api.post('/profile/me/picture', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
};

export const completeComedyOnboarding = async (answers) => {
  const { data } = await api.post('/profile/me/comedy-onboarding', answers);
  return data;
};

export const createLiveRoom = async (payload) => {
  const { data } = await videoApi.post('/videos/live/rooms', payload);
  return data;
};

export const startLiveRoom = async (id) => {
  const { data } = await videoApi.post(`/videos/live/rooms/${id}/start`);
  return data;
};

export const getNotifications = async (type) => {
  const { data } = await api.get('/dashboard/notifications', { params: type && type !== 'all' ? { type } : undefined });
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await api.patch(`/dashboard/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await api.post('/dashboard/notifications/read-all');
  return data;
};

export const getActivityFeed = async () => {
  const { data } = await api.get('/dashboard/activity');
  return data;
};

export const uploadAsset = async (payload) => {
  const { data } = await api.post('/dashboard/upload', payload);
  return data;
};
