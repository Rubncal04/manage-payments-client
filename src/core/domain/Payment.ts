export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  payment_date: string;
  status: PaymentStatus;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'processing' | 'completed' | 'rejected';

export interface CreatePaymentDTO {
  amount: number;
}

export interface UpdatePaymentDTO {
  status?: PaymentStatus;
  error?: string;
} 