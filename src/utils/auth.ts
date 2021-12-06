import type { WithNull } from '@/typings';

export function getToken(): WithNull<string> {
  return localStorage.getItem('TOKEN') || '';
}

export function setToken(token: string): void {
  return localStorage.setItem('TOKEN', token);
}

export const TOKEN_HEADER = 'access-token';
