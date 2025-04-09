import { apiClient } from '../../infrastructure/api/apiClient';
import { User } from '../domain/User';
import { Payment } from '../domain/Payment';

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      const response = await apiClient.get('/users');
      return response.data;
    },
    getById: async (id: string): Promise<User> => {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    },
    create: async (user: Omit<User, 'id'>): Promise<User> => {
      const response = await apiClient.post('/users', user);
      return response.data;
    },
    update: async (id: string, user: Partial<User>): Promise<User> => {
      const response = await apiClient.put(`/users/${id}`, user);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/users/${id}`);
    }
  },
  payments: {
    getAll: async (): Promise<Payment[]> => {
      const response = await apiClient.get('/payments');
      return response.data;
    },
    getById: async (id: string): Promise<Payment> => {
      const response = await apiClient.get(`/payments/${id}`);
      return response.data;
    },
    create: async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
      const response = await apiClient.post('/payments', payment);
      return response.data;
    },
    update: async (id: string, payment: Partial<Payment>): Promise<Payment> => {
      const response = await apiClient.put(`/payments/${id}`, payment);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/payments/${id}`);
    }
  }
};
