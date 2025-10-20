import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with the actual FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;