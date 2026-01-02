import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Tumhara Backend URL
});

// Request Interceptor: Har request me Token add karega
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;