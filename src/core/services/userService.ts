import { api } from './api';
import { User, CreateUserDTO, UpdateUserDTO } from '../domain/User';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/api/v1/users');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error('Error al cargar usuarios');
    }
  },

  createUser: async (user: CreateUserDTO): Promise<User> => {
    try {
      const response = await api.post('/api/v1/users', user);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error('Error al crear usuario');
    }
  },

  updateUser: async (userId: string, user: UpdateUserDTO): Promise<User> => {
    try {
      const response = await api.patch(`/api/v1/users/${userId}`, user);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error('Error al actualizar usuario');
    }
  },

  deleteUser: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/users/${userId}`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw new Error('Error al eliminar usuario');
    }
  }
}; 