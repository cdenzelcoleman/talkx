import axios from 'axios';

// I'm creating an Axios instance with the base URL from env
// This centralizes API configuration and interceptors
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// I'm adding a request interceptor to attach JWT tokens
// This automatically adds the Authorization header to all requests
api.interceptors.request.use(
  (config) => {
    // I'm getting the token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // I'm adding the Bearer token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// I'm adding a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    // I'm passing through successful responses
    return response;
  },
  (error) => {
    // I'm handling authentication errors
    if (error.response && error.response.status === 401) {
      // I'm clearing the token and redirecting to login
      localStorage.removeItem('token');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default api;
