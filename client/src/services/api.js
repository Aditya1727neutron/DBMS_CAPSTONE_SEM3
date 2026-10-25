import axios from 'axios';

// Vite dev proxy forwards /api to http://localhost:5000/api
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fcb_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize Errors (Never swallow or substitute fake data)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalizedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred with the server.',
      status: error.response?.status || 500,
      details: error.response?.data?.details || error.response?.data?.errors || null,
    };

    if (error.response?.status === 401) {
      // Clear token on authentication expiry
      localStorage.removeItem('fcb_auth_token');
    }

    return Promise.reject(normalizedError);
  }
);

export default api;
