import { apiRequest } from './client';

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  nickname: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}
