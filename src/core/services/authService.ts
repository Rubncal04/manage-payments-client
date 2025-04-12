import { AxiosError } from 'axios';
import { RegisterDTO, LoginDTO, AuthResponse } from '../domain/Auth';
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
  register: async (userData: RegisterDTO): Promise<AuthResponse> => {
    try {
      const response = await baseClient.post<AuthResponse>('/register', userData);
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    try {
      const response = await baseClient.post<AuthResponse>('/login', credentials);
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    try {
      const response = await baseClient.post<{ access_token: string }>('/refresh', { refresh_token: refreshToken });
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (error) {
      return handleAuthError(error);
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  }
}; 