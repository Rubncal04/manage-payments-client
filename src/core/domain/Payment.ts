export interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  user_id: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
}

export interface PaymentStatus {
  status: 'pending' | 'processing' | 'success' | 'failed';
  message: string;
}

export interface CreatePaymentDTO {
  amount: number;
  payment_date: string;
  user_id: string;
}

export interface UpdatePaymentDTO {
  amount?: number;
  payment_date?: string;
  status?: 'pending' | 'processing' | 'success' | 'failed';
} 