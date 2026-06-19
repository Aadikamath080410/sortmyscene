import { apiFetch, setToken } from './api';
import { ApiUser } from '../types';

interface AuthResponse {
  message: string;
  user: ApiUser;
  token: string;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<ApiUser> {
  const data = await apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function login(email: string, password: string): Promise<ApiUser> {
  const data = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function fetchCurrentUser(): Promise<ApiUser | null> {
  try {
    return await apiFetch<ApiUser>('/api/auth/me', {}, true);
  } catch {
    setToken(null);
    return null;
  }
}

export function logout(): void {
  setToken(null);
}
