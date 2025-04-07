import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un estado de error
      console.error('Error response:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error request:', error.request);
      return Promise.reject(error.request);
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error:', error.message);
      return Promise.reject(error.message);
    }
  }
); 