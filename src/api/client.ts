import { z } from 'zod';
import {
  User,
  Profile,
  MoodCheckin,
  Task,
  ScheduleBlock,
  InsightsData,
  NotificationItem,
  ChatMessage,
  MoodType,
} from '../types/index.ts';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');

export class AppError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

// Token storage helper
export function getAuthToken(): string | null {
  return localStorage.getItem('moodsync_token') || 'Bearer usr_default';
}

export function setAuthToken(token: string): void {
  localStorage.setItem('moodsync_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('moodsync_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', token.startsWith('Bearer ') ? token : `Bearer ${token}`);
  }

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errObj = json.error || {
          code: `HTTP_${res.status}`,
          message: res.statusText || 'Request failed',
        };
        throw new AppError(errObj.code, errObj.message, errObj.details);
      }

      return json.data as T;
    } catch (err: any) {
      const isGet = !options.method || options.method === 'GET';
      if (isGet && attempt < retries) {
        attempt++;
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 200));
        continue;
      }
      if (err instanceof AppError) throw err;
      throw new AppError('NETWORK_ERROR', err?.message || 'Network communication error');
    }
  }
  throw new AppError('MAX_RETRIES_EXCEEDED', 'Unable to complete request.');
}

// Zod Schemas for runtime safety
export const TaskZodSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string().min(1),
  description: z.string().optional().default(''),
  duration_minutes: z.number().positive(),
  priority: z.enum(['low', 'medium', 'high']),
  required_focus: z.enum(['low', 'medium', 'high']),
  category: z.enum(['deep_focus', 'nourish', 'spiritual', 'gentle_pace', 'general']),
  due_date: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  scheduled_time: z.string().optional(),
  order_index: z.number().default(0),
});

export const MoodCheckinZodSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  mood: z.enum(['energetic', 'happy', 'calm', 'tired', 'low']),
  energy_level: z.number().min(1).max(5),
  focus_level: z.number().min(1).max(5),
  note: z.string().optional(),
  created_at: z.string(),
});

// API Client Functions
export const api = {
  auth: {
    signup: (email: string, password: string) =>
      request<{ user: User; profile: Profile; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      request<{ user: User; profile: Profile; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    google: (email = 'maya@mindfulday.com') =>
      request<{ user: User; profile: Profile; token: string }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    logout: () =>
      request<{ message: string }>('/auth/logout', { method: 'POST' }),
    me: () =>
      request<{ user: User; profile: Profile }>('/auth/me'),
  },

  profile: {
    get: () => request<Profile>('/profile'),
    update: (updates: Partial<Profile>) =>
      request<Profile>('/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
  },

  moodCheckins: {
    create: (data: { mood: MoodType; energy_level: number; focus_level: number; note?: string }) =>
      request<{ checkin: MoodCheckin; paceNote: string; scheduleBlocksCount: number }>(
        '/mood-checkins',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      ),
    list: (limit = 30) => request<MoodCheckin[]>(`/mood-checkins?limit=${limit}`),
    latest: () => request<MoodCheckin | null>('/mood-checkins/latest'),
  },

  tasks: {
    list: (filter?: { status?: string; due_date?: string }) => {
      const q = new URLSearchParams();
      if (filter?.status) q.set('status', filter.status);
      if (filter?.due_date) q.set('due_date', filter.due_date);
      const query = q.toString() ? `?${q.toString()}` : '';
      return request<Task[]>(`/tasks${query}`);
    },
    get: (id: string) => request<Task>(`/tasks/${id}`),
    create: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'order_index'>) =>
      request<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      }),
    update: (id: string, updates: Partial<Task>) =>
      request<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' }),
    toggleComplete: (id: string) =>
      request<Task>(`/tasks/${id}/complete`, { method: 'PATCH' }),
  },

  schedule: {
    get: (date?: string) => {
      const d = date ? `?date=${date}` : '';
      return request<ScheduleBlock[]>(`/schedule${d}`);
    },
    generate: (date?: string) =>
      request<{ scheduleBlocks: ScheduleBlock[]; paceNote: string }>('/schedule/generate', {
        method: 'POST',
        body: JSON.stringify({ date }),
      }),
    accept: (id: string) =>
      request<ScheduleBlock>(`/schedule/blocks/${id}/accept`, { method: 'PATCH' }),
    reject: (id: string) =>
      request<ScheduleBlock>(`/schedule/blocks/${id}/reject`, { method: 'PATCH' }),
    move: (id: string, start_time: string, end_time: string) =>
      request<ScheduleBlock>(`/schedule/blocks/${id}/move`, {
        method: 'PATCH',
        body: JSON.stringify({ start_time, end_time }),
      }),
  },

  insights: {
    get: (days = 7) => request<InsightsData>(`/insights?days=${days}`),
  },

  notifications: {
    list: (category?: string) => {
      const c = category ? `?category=${category}` : '';
      return request<NotificationItem[]>(`/notifications${c}`);
    },
    markRead: (id: string) =>
      request<NotificationItem>(`/notifications/${id}/read`, { method: 'PATCH' }),
  },

  buddy: {
    getMessages: () => request<ChatMessage[]>('/buddy/messages'),
    sendMessage: (text: string) =>
      request<{ userMessage: ChatMessage; buddyReply: ChatMessage }>('/buddy/chat', {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
  },
};
