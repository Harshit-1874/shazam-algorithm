import axios from 'axios';

const API_BASE_URL = '/api';

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

export const identifySong = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    const response = await apiClient.post('/identify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        // You could use this to show upload progress if needed
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.detail || 'Failed to identify song');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      throw new Error('No response from server. Please check your connection and try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      throw error;
    }
  }
};

// You can add more API methods here as needed
export const getSongDetails = async (songId) => {
  try {
    const response = await apiClient.get(`/songs/${songId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching song details:', error);
    throw error;
  }
};