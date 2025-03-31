import { api } from './api';
import { User } from '../domain/User';

export interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  user_id: string;
  status: string;
}

export interface PaymentStatus {
  status: 'pending' | 'processing' | 'success' | 'failed';
  message: string;
}

export const paymentService = {
  createPayment: async (userId: string): Promise<Payment> => {
    try {
      const payment = {
        amount: 8500,
        payment_date: new Date().toISOString(),
        user_id: userId,
        status: 'completed'
      };

      const response = await api.post(`/api/v1/${userId}/payments`, payment);
      return response.data;
    } catch (error) {
      console.error('Error en la creación del pago:', error);
      throw new Error('Error al procesar el pago');
    }
  },

  getPaymentsByUser: async (userId: string): Promise<Payment[]> => {
    try {
      const response = await api.get(`/api/v1/${userId}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los pagos:', error);
      throw new Error('Error al cargar el historial de pagos');
    }
  }
};
