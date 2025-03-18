import axios from 'axios';

const API_BASE_URL = '/api';

export const identifySong = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await axios.post(`${API_BASE_URL}/identify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};