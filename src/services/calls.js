import axiosInstance from '../Utlis/axiosConfig';

export const fetchCalls = async (offset = 0, limit = 10) => {
  const response = await axiosInstance.get(`/calls?offset=${offset}&limit=${limit}`);
  return response.data;
};

export const fetchCall = async (id) => {
  const response = await axiosInstance.get(`/calls/${id}`);
  return response.data;
};

export const archiveCall = async (id) => {
  const response = await axiosInstance.put(`/calls/${id}/archive`);
  return response.data;
};

export const addNote = async (id, content) => {
  const response = await axiosInstance.post(`/calls/${id}/note`, { content });
  return response.data;
};