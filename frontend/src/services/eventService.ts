import { apiFetch } from './api';
import { ApiEvent, ApiEventDetail } from '../types';

export async function fetchEvents(): Promise<ApiEvent[]> {
  return apiFetch<ApiEvent[]>('/api/events');
}

export async function fetchEventById(id: string): Promise<ApiEventDetail> {
  return apiFetch<ApiEventDetail>(`/api/events/${id}`);
}
