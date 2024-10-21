import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/ai'; 

const getAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const generateEmailContent = async (prompt) => {
  const response = await axios.post(`${API_URL}/generate-email`, { prompt }, getAuthHeaders());
  return response.data.content;
};

export const generateTemplate = async (templateType) => {
  const response = await axios.post(`${API_URL}/generate-template`, 
    { template_type: templateType }, 
    getAuthHeaders()
  );
  return response.data.template;
};

export const improveEmail = async (emailContent) => {
  const response = await axios.post(`${API_URL}/improve-email`, 
    { content: emailContent }, 
    getAuthHeaders()
  );
  return response.data.improved_content;
};

export const analyzeSentiment = async (emailContent) => {
  const response = await axios.post(`${API_URL}/analyze-sentiment`, 
    { content: emailContent }, 
    getAuthHeaders()
  );
  return response.data.sentiment;
};