import axios from 'axios';

const API_URL = 'http://35.172.141.151:8000/api/v1/templates';  

const getAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const getTemplates = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createTemplate = async (template) => {
  const response = await axios.post(API_URL, template, getAuthHeaders());   
  return response.data;
};

export const updateTemplate = async (id, template) => {
  const response = await axios.put(`${API_URL}/${id}`, template, getAuthHeaders());
  return response.data;
};

export const deleteTemplate = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};