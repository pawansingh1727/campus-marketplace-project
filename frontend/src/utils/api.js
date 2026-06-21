import axios from 'axios';
import store from '../store.js';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const { auth } = store.getState();
  if (auth.userInfo && auth.userInfo.token) {
    config.headers.Authorization = `Bearer ${auth.userInfo.token}`;
  }
  return config;
});

export default api;
