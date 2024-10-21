import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1'; 

const getAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const getUnreadCount = async () => {
  const response = await axios.get(`${API_URL}/emails/unread`, getAuthHeaders());
  return response.data.unread_count;
};

export const getTemplatesCount = async () => {
  const response = await axios.get(`${API_URL}/templates`, getAuthHeaders());
  return response.data.length;
};

export const sendEmail = async (formData) => {
    const response = await axios.post(`${API_URL}/emails/send`, formData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };
  
  export const createDraft = async (draftData) => {
    const response = await axios.post(`${API_URL}/emails/drafts`, draftData, getAuthHeaders());
    return response.data;
  };

export const getDraftsCount = async () => {
  const response = await axios.get(`${API_URL}/emails/drafts`, getAuthHeaders());
  return response.data.length;
};

export const getInboxEmails = async () => {
  const response = await axios.get(`${API_URL}/emails/inbox`, getAuthHeaders());
  return response.data;
};

export const markEmailAsRead = async (emailId) => {
  await axios.post(`${API_URL}/emails/${emailId}/mark-as-read`, {}, getAuthHeaders());
};

export const searchEmails = async (query, folder = 'inbox') => {
  const response = await axios.get(`${API_URL}/emails/search?query=${query}&folder=${folder}`, getAuthHeaders());
  return response.data;
};

export const getSentEmails = async (skip = 0, limit = 100) => {
    const response = await axios.get(`${API_URL}/emails/sent?skip=${skip}&limit=${limit}`, getAuthHeaders());
    return response.data;
  };

export const getDrafts = async () => {
  const response = await axios.get(`${API_URL}/emails/drafts`, getAuthHeaders());
  return response.data;
};

export const updateDraft = async (draftId, updatedDraft) => {
  const response = await axios.put(`${API_URL}/emails/drafts/${draftId}`, updatedDraft, getAuthHeaders());
  return response.data;
};