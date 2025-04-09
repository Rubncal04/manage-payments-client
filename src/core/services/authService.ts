import { AxiosError } from 'axios';
import { RegisterDTO, LoginDTO, AuthResponse, RefreshTokenDTO } from '../domain/Auth';
import { baseClient } from '../../infrastructure/api/apiClient';

const handleAuthError = (error: any): never => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<any>;
    if (axiosError.response?.data) {
      throw new Error(axiosError.response.data.message || 'Error en la autenticación');
    }
  }
  throw new Error('Error en la conexión con el servidor');
};

export const authService = {
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    try {
      const response = await baseClient.post('/register', data);
      return response.data;
    } catch (error) {
      console.error('Error en el registro:', error);
      return handleAuthError(error);
    }
  },

  login: async (data: LoginDTO): Promise<AuthResponse> => {
    try {
      console.log('Intentando login en:', baseClient.defaults.baseURL); // Debug log
      const response = await baseClient.post('/login', data);
      console.log('Respuesta del servidor:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error en el login:', error);
      return handleAuthError(error);
    }
  },

  refreshToken: async (data: RefreshTokenDTO): Promise<AuthResponse> => {
    try {
      const response = await baseClient.post('/refresh', data);
      return response.data;
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      return handleAuthError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/auth/login';
  }
}; 