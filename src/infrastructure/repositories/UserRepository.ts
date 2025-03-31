import { apiClient } from '../api/apiClient';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { User, CreateUserDTO, UpdateUserDTO } from '../../core/domain/User';

export class UserRepository implements IUserRepository {
  private readonly endpoint = '/users';

  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>(this.endpoint);
    return response.data;
  }

  async getById(id: string): Promise<User | null> {
    const response = await apiClient.get<User>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(user: CreateUserDTO): Promise<User> {
    const response = await apiClient.post<User>(this.endpoint, user);
    return response.data;
  }

  async update(id: string, user: UpdateUserDTO): Promise<User> {
    const response = await apiClient.put<User>(`${this.endpoint}/${id}`, user);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  async getByPaymentStatus(status: 'pending' | 'paid' | 'overdue'): Promise<User[]> {
    const response = await apiClient.get<User[]>(`${this.endpoint}/status/${status}`);
    return response.data;
  }

  async getUsersWithUpcomingPayments(): Promise<User[]> {
    const response = await apiClient.get<User[]>(`${this.endpoint}/upcoming-payments`);
    return response.data;
  }
} 