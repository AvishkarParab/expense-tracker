export interface AuthResponseDto {
  access_token: string;
  token_type: string;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  created_at: string;
}
