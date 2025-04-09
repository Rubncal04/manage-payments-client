import axios from 'axios';
import { authService } from '../../core/services/authService';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9120';

// Cliente base sin autenticación (para login/register)
export const baseClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente con autenticación
export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar headers por defecto para Authorization
const token = localStorage.getItem('token');
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor para agregar el token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token en interceptor:', token); // Debug log
    
    if (token) {
      // Asegurarnos de que config.headers exista
      config.headers = config.headers || {};
      
      // Establecer el header de autorización
      config.headers.Authorization = `Bearer ${token}`;
      
      console.log('Headers configurados:', {
        Authorization: config.headers.Authorization,
        'Content-Type': config.headers['Content-Type']
      }); // Debug log
    } else {
      console.log('No se encontró token'); // Debug log
    }
    
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para manejar errores y refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await authService.refreshToken({ refresh_token: refreshToken });
        const { access_token, refresh_token } = response;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Actualizar los headers por defecto
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Actualizar los headers de la petición original
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        processQueue(null, access_token);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
); 