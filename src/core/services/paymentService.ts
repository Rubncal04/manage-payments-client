import { apiClient } from '../../infrastructure/api/apiClient';

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  payment_date: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'processing' | 'completed' | 'failed';

export interface CreatePaymentDTO {
  client_id: string;
  amount: number;
}

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
    try {
      const response = await apiClient.get(`/clients/${clientId}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client payments:', error);
      throw error;
    }
  },

  createPayment: async (paymentData: CreatePaymentDTO): Promise<Payment> => {
    try {
      const response = await apiClient.post(`/clients/${paymentData.client_id}/payments`, {
        amount: paymentData.amount
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  getPaymentStatus: async (clientId: string, paymentId: string): Promise<Payment> => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }
};
