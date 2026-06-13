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

export type EmailVerificationRequest = {
  email: string;
};

export type EmailVerificationResponse = {
  success: boolean;
};

export function requestEmailVerification(
  payload: EmailVerificationRequest,
): Promise<EmailVerificationResponse> {
  return apiRequest<EmailVerificationResponse>('/api/auth/email/verification-code', {
    method: 'POST',
    body: payload,
  });
}

export type EmailVerificationConfirmRequest = {
  email: string;
  code: string;
};

export type EmailVerificationConfirmResponse = {
  verified: boolean;
};

export function confirmEmailVerification(
  payload: EmailVerificationConfirmRequest,
): Promise<EmailVerificationConfirmResponse> {
  return apiRequest<EmailVerificationConfirmResponse>(
    '/api/auth/email/verification-code/confirm',
    { method: 'POST', body: payload },
  );
}

export type NicknameCheckResponse = {
  available: boolean;
};

export function checkNickname(nickname: string): Promise<NicknameCheckResponse> {
  return apiRequest<NicknameCheckResponse>(
    `/api/users/check-nickname?nickname=${encodeURIComponent(nickname)}`,
  );
}

export type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

export type SignupResponse = {
  email: string;
  nickname: string;
};

export function signup(payload: SignupRequest): Promise<SignupResponse> {
  return apiRequest<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    body: payload,
  });
}
