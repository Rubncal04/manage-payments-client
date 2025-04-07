import { User, CreateUserDTO, UpdateUserDTO } from '../domain/User';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  create(user: CreateUserDTO): Promise<User>;
  update(id: string, user: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
  getByPaymentStatus(status: 'pending' | 'paid' | 'overdue'): Promise<User[]>;
  getUsersWithUpcomingPayments(): Promise<User[]>;
}
