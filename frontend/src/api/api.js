import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // <-- Critical
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;