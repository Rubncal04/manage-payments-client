import { apiClient } from '../../infrastructure/api/apiClient';
import { User, CreateUserDTO, UpdateUserDTO } from '../domain/User';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (user: CreateUserDTO): Promise<User> => {
    const response = await apiClient.post('/users', user);
    return response.data;
  },

  updateUser: async (id: string, user: UpdateUserDTO): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  }
};
