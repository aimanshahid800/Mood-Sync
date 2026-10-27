export type MoodType = 'energetic' | 'happy' | 'calm' | 'tired' | 'low';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRequiredFocus = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type ScheduleBlockSource = 'suggested' | 'manual';
export type ScheduleBlockStatus = 'suggested' | 'accepted' | 'rejected';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface SchedulingPreferences {
  working_hours_start: string; // "09:00"
  working_hours_end: string;   // "18:00"
  break_length_minutes: number; // 15
  preferred_energy_times: {
    morning: 'high' | 'medium' | 'low';
    afternoon: 'high' | 'medium' | 'low';
    evening: 'high' | 'medium' | 'low';
  };
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string;
  tagline: string;
  timezone: string;
  ramadan_mode: boolean;
  prayer_location: string;
  prayer_calculation: string;
  notifications_enabled: boolean;
  theme: 'tactile_cozy' | 'serene_blue' | 'warm_sandstone';
  preferences: SchedulingPreferences;
}

export interface MoodCheckin {
  id: string;
  user_id: string;
  mood: MoodType;
  energy_level: number; // 1 - 5
  focus_level: number;  // 1 - 5
  note?: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  priority: TaskPriority;
  required_focus: TaskRequiredFocus;
  category: 'deep_focus' | 'nourish' | 'spiritual' | 'gentle_pace' | 'general';
  due_date: string; // YYYY-MM-DD
  status: TaskStatus;
  scheduled_time?: string; // HH:MM AM/PM
  order_index: number;
  created_at: string;
  completed_at?: string;
}

export interface ScheduleBlock {
  id: string;
  user_id: string;
  task_id: string;
  task?: Task;
  date: string; // YYYY-MM-DD
  start_time: string; // "09:00"
  end_time: string;   // "09:45"
  source: ScheduleBlockSource;
  status: ScheduleBlockStatus;
  reason?: string;
}

export interface InsightsData {
  mood_trends: Array<{
    date: string;
    day_name: string;
    mood: MoodType;
    energy_level: number;
    focus_level: number;
  }>;
  completion_rate: number; // percentage, e.g. 92
  completed_tasks_count: number;
  total_tasks_count: number;
  best_focus_hours: Array<{
    hour: string;
    label: string;
    score: number; // 1-100
  }>;
  weekly_harmony_score: number;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  category: 'all' | 'reminders' | 'ai' | 'moments';
  title: string;
  message: string;
  timestamp_text: string;
  read: boolean;
  action_label?: string;
  secondary_action_label?: string;
  icon_type: 'sparkle' | 'moon' | 'bell' | 'heart';
  badge_color: 'viridian' | 'sandstone' | 'candy' | 'azur';
}

export interface ChatMessage {
  id: string;
  user_id: string;
  sender: 'buddy' | 'user';
  text: string;
  timestamp_text: string;
  suggestions?: {
    moved?: string;
    kept?: string;
    swapped?: string;
    chips?: Array<{ id: string; label: string; action: string }>;
  };
}

export interface AppErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
