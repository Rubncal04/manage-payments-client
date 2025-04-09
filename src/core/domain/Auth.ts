export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  name: string;
  cell_phone: string;
  date_to_pay: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshTokenDTO {
  refresh_token: string;
} 