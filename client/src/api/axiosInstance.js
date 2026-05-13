import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = window.localStorage.getItem('refresh_token');

    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
      window.localStorage.setItem('access_token', accessToken);
      window.localStorage.setItem('refresh_token', newRefreshToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default api;
