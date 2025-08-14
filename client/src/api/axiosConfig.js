import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = "http://localhost:3000/api/v1";

// Create a new Axios instance
const api = axios.create({
  baseURL: API_BASE_URL
});

// Request Interceptor: Injects the token into headers before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Response Interceptor: Handles 403 session errors globally
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error) => {
    // Check if the error is for an expired session
    if (error.response && error.response.status === 403) {
      localStorage.removeItem('token');
      // Using window.location.href forces a full page reload to clear state
      window.location.href = '/'; 
      toast.error('Session expired. Please log in again.');
    }
    // Return other errors to be handled by the component's catch block
    return Promise.reject(error);
  }
);

export default api;