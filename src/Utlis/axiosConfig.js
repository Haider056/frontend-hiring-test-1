import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://frontend-test-api.aircall.dev',
});

export const setAuthorizationHeader = (access_token) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
};

export default axiosInstance;