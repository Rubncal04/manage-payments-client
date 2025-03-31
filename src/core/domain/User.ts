export interface User {
  id: string;
  name: string;
  cell_phone: string;
  date_to_pay: string;
  paid: boolean;
  status: string;
  last_payment_date: string;
}

export interface CreateUserDTO {
  name: string;
  cell_phone: string;
  date_to_pay: string;
}

export interface UpdateUserDTO {
  Name?: string;
  CellPhone?: string;
  Paid?: boolean;
  DateToPay?: string;
  ChatId?: string;
} 