import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1'; 

const getAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/auth/profile`, getAuthHeaders());
  return response.data;
};

export const updateUserEmail = async (newEmail) => {
  const response = await axios.put(`${API_URL}/auth/update-email`, { email: newEmail }, getAuthHeaders());
  return response.data;
};

export const updateUserPassword = async (currentPassword, newPassword) => {
  const response = await axios.put(`${API_URL}/auth/update-password`, 
    { current_password: currentPassword, new_password: newPassword }, 
    getAuthHeaders()
  );
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await axios.post(`${API_URL}/subscriptions/cancel`, {}, getAuthHeaders());
  return response.data;
};

export const useActivationCode = async (activationCode) => {
  const response = await axios.post(`${API_URL}/subscriptions/activate`, 
    { activation_code: activationCode }, 
    getAuthHeaders()
  );
  return response.data;
};

export const getWhiteLabel = async () => {
  const response = await axios.get(`${API_URL}/white-label`, getAuthHeaders());
  return response.data;
};

export const updateWhiteLabel = async (data) => {
  const formData = new FormData();
  if (data.platform_name) formData.append('platform_name', data.platform_name);
  if (data.logo) formData.append('logo', data.logo);

  const headers = {
    ...getAuthHeaders().headers,
    'Content-Type': 'multipart/form-data',
  };

  const response = await axios.put(`${API_URL}/white-label`, formData, { headers });
  return response.data;
};