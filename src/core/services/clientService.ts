import { apiClient } from '../../infrastructure/api/apiClient';
import { Client, CreateClientDTO, UpdateClientDTO } from '../domain/Client';

export const clientService = {
  getAllClients: async (): Promise<Client[]> => {
    try {
      const response = await apiClient.get('/clients');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  getClientById: async (id: string): Promise<Client> => {
    try {
      const response = await apiClient.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  createClient: async (client: CreateClientDTO): Promise<Client> => {
    try {
      const response = await apiClient.post('/clients', client);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  updateClient: async (id: string, client: UpdateClientDTO): Promise<Client> => {
    try {
      const response = await apiClient.put(`/clients/${id}`, client);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  deleteClient: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/clients/${id}`);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};
