import { AuthResponse } from '@shared/api';
import { api } from './api';

export function login(email: string, password: string, rememberMe: boolean): Promise<AuthResponse> {
  return api<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  });
}

export function signUp(fullName: string, email: string, mobile: string, password: string): Promise<AuthResponse> {
  return api<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, mobile, password }),
  });
}
