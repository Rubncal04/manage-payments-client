import { apiClient } from '../../infrastructure/api/apiClient';
import { Client, CreateClientDTO, UpdateClientDTO } from '../domain/Client';

export const clientService = {
  getAllClients: async (): Promise<Client[]> => {
    const response = await apiClient.get('/clients');
    return response.data;
  },

  getClientById: async (id: string): Promise<Client> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  createClient: async (client: CreateClientDTO): Promise<Client> => {
    const response = await apiClient.post('/clients', client);
    return response.data;
  },

  updateClient: async (id: string, client: UpdateClientDTO): Promise<Client> => {
    const response = await apiClient.put(`/clients/${id}`, client);
    return response.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  }
};
