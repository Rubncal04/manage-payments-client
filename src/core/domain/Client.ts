export interface Client {
  id: string;
  user_id: string;
  name: string;
  cell_phone: string;
  day_to_pay: number;
  status: 'active' | 'inactive';
  last_payment_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateClientDTO {
  name: string;
  cell_phone: string;
  day_to_pay: number;
}

export interface UpdateClientDTO {
  name?: string;
  cell_phone?: string;
  day_to_pay?: number;
}
