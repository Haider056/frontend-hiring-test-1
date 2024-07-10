import axios from 'axios';
import axiosInstance, { setAuthorizationHeader } from '../Utlis/axiosConfig';

const api = axios.create({
  baseURL: 'https://frontend-test-api.aircall.dev',
});

let refreshTimeout;

const scheduleTokenRefresh = (expiresIn) => {
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(async () => {
    try {
      const response = await refreshToken(localStorage.getItem('refresh_token'));
      setAuthorizationHeader(response.access_token);
      scheduleTokenRefresh(response.expires_in * 1000 - 60000); 
    } catch (error) {
      console.error('Error refreshing token', error);
    }
  }, expiresIn - 60000);
};

export const login = async (username, password) => {
  const response = await axiosInstance.post('/auth/login', { username, password });
  const { access_token, expires_in, refresh_token } = response.data;
  setAuthorizationHeader(access_token);
  localStorage.setItem('refresh_token', refresh_token);
  scheduleTokenRefresh(expires_in * 1000); 
  return response.data;
};

export const refreshToken = async (token) => {
  const response = await axiosInstance.post('/auth/refresh-token', { token });
  const { access_token, expires_in, refresh_token } = response.data;
  setAuthorizationHeader(access_token);
  localStorage.setItem('refresh_token', refresh_token);
  scheduleTokenRefresh(expires_in * 1000); 
  return response.data;
};
export const handleLogout = (navigate) => {
  clearTimeout(refreshTimeout);
  localStorage.removeItem('refresh_token');
  setAuthorizationHeader(null);
  navigate('./'); 
};
export default api;