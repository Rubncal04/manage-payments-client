import { apiClient } from '../../infrastructure/api/apiClient';
import { Payment, PaymentStatus, CreatePaymentDTO, UpdatePaymentDTO } from '../domain/Payment';

export const paymentService = {
  getAllPayments: async (): Promise<Payment[]> => {
    try {
      const response = await apiClient.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  getPaymentsByClient: async (clientId: string): Promise<Payment[]> => {
    const response = await apiClient.get(`/clients/${clientId}/payments`);
    return response.data;
  },

  createPayment: async (payment: CreatePaymentDTO): Promise<Payment> => {
    try {
      const response = await apiClient.post('/payments', payment);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  updatePayment: async (id: string, payment: UpdatePaymentDTO): Promise<Payment> => {
    try {
      const response = await apiClient.put(`/payments/${id}`, payment);
      return response.data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  },

  deletePayment: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/payments/${id}`);
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  },

  getPaymentStatus: async (id: string): Promise<PaymentStatus> => {
    try {
      const response = await apiClient.get(`/payments/${id}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }
};
