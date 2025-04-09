import { apiClient } from '../../infrastructure/api/apiClient';
import { Payment, PaymentStatus, CreatePaymentDTO, UpdatePaymentDTO } from '../domain/Payment';

export const paymentService = {
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get('/payments');
    return response.data;
  },
  getPaymentById: async (id: string): Promise<Payment> => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },
  createPayment: async (payment: CreatePaymentDTO): Promise<Payment> => {
    const response = await apiClient.post('/payments', payment);
    return response.data;
  },
  updatePayment: async (id: string, payment: UpdatePaymentDTO): Promise<Payment> => {
    const response = await apiClient.put(`/payments/${id}`, payment);
    return response.data;
  },
  deletePayment: async (id: string): Promise<void> => {
    await apiClient.delete(`/payments/${id}`);
  },
  getPaymentStatus: async (id: string): Promise<PaymentStatus> => {
    const response = await apiClient.get(`/payments/${id}/status`);
    return response.data;
  }
};
