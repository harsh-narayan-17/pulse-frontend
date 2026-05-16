import { api } from '@/lib/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  signup: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/signup', { name, email, password }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/login', { email, password }),
};
