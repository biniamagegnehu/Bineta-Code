import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 12000
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem('bineta_admin_token');
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

export function getErrorMessage(error) {
  if (error.response?.data?.error) return error.response.data.error;
  if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
  if (error.response) return 'The request could not be completed. Please try again.';
  return 'The API is unavailable. Check that the backend and database are running.';
}

export function assetUrl(path) {
  if (!path) return '';
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  return `${base}${path}`;
}
