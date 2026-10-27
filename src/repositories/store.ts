import {
  User,
  Profile,
  MoodCheckin,
  Task,
  ScheduleBlock,
  NotificationItem,
  ChatMessage,
  InsightsData,
  MoodType,
} from '../types/index.ts';

class MemoryStore {
  private users: User[] = [
    {
      id: 'usr_default',
      email: 'maya@mindfulday.com',
      created_at: '2026-10-01T08:00:00Z',
    },
  ];

  private profiles: Profile[] = [
    {
      id: 'prof_default',
      user_id: 'usr_default',
      display_name: 'Amina Malik',
      avatar_url: 'https://lh3.googleusercontent.com/aida/AEtjO1X3zeshPl0NQyOmIkohX8vS5sPpUk_5Xs97ttoqdMe7gBapk7Z5eScvwVO1NGaOcpOh__PlVo71nZjtvvbxdsdy2ApmRTmhWQoTl8TZGBNF8J_IBFrgTAqp6lXulikGZlyjV5ml--lqvVbij0TE905L5MX49WvTYusuE8QvnNyXc7DxH-dKhh6-epOsn2G4qStIyLHH7O6Jmpd_MPBGWY7532oHzRS_F0XJAMghbXE8ayOfV7HdVJZQiQ4',
      tagline: 'Mindful Rhythm • Serene Mode',
      timezone: 'Europe/London',
      ramadan_mode: true,
      prayer_location: 'London, UK',
      prayer_calculation: 'Hanafi calculation',
      notifications_enabled: true,
      theme: 'tactile_cozy',
      preferences: {
        working_hours_start: '09:00',
        working_hours_end: '18:00',
        break_length_minutes: 15,
        preferred_energy_times: {
          morning: 'high',
          afternoon: 'medium',
          evening: 'low',
        },
      },
    },
  ];

  private moodCheckins: MoodCheckin[] = [
    {
      id: 'chk_today',
      user_id: 'usr_default',
      mood: 'happy',
      energy_level: 4,
      focus_level: 4,
      note: 'Sunshine warmth and cheerful momentum.',
      created_at: new Date().toISOString(),
    },
    // Historical entries for the past 6 days for trends
    {
      id: 'chk_1',
      user_id: 'usr_default',
      mood: 'energetic',
      energy_level: 5,
      focus_level: 5,
      note: 'High creative flow',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'chk_2',
      user_id: 'usr_default',
      mood: 'calm',
      energy_level: 3,
      focus_level: 4,
      note: 'Quiet peaceful rhythm',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'chk_3',
      user_id: 'usr_default',
      mood: 'tired',
      energy_level: 2,
      focus_level: 2,
      note: 'Needed afternoon nap',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'chk_4',
      user_id: 'usr_default',
      mood: 'happy',
      energy_level: 4,
      focus_level: 3,
      note: 'Connected with teammates',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'chk_5',
      user_id: 'usr_default',
      mood: 'calm',
      energy_level: 3,
      focus_level: 3,
      note: 'Steady progress on sprint goals',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'chk_6',
      user_id: 'usr_default',
      mood: 'low',
      energy_level: 2,
      focus_level: 1,
      note: 'Took generous rest',
      created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
  ];

  private tasks: Task[] = [
    {
      id: 'task_1',
      user_id: 'usr_default',
      title: 'Review Design System Tokens',
      description: 'Check color contrast and organic squircle radiuses',
      duration_minutes: 45,
      priority: 'high',
      required_focus: 'high',
      category: 'deep_focus',
      due_date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      scheduled_time: '10:00 AM',
      order_index: 0,
      created_at: '2026-10-26T08:30:00Z',
    },
    {
      id: 'task_2',
      user_id: 'usr_default',
      title: 'Warm Herbal Tea & 10m Gentle Walk',
      description: 'Step away from screen, breathe fresh garden air',
      duration_minutes: 15,
      priority: 'low',
      required_focus: 'low',
      category: 'nourish',
      due_date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      scheduled_time: '11:30 AM',
      order_index: 1,
      created_at: '2026-10-26T08:31:00Z',
    },
    {
      id: 'task_3',
      user_id: 'usr_default',
      title: 'Dhuhr Prayer & Mindful Stillness',
      description: 'Midday reflection and peace',
      duration_minutes: 20,
      priority: 'medium',
      required_focus: 'low',
      category: 'spiritual',
      due_date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      scheduled_time: '12:45 PM',
      order_index: 2,
      created_at: '2026-10-26T08:32:00Z',
    },
    {
      id: 'task_4',
      user_id: 'usr_default',
      title: 'Catch up on Team Voice Notes',
      description: 'Listen to asynchronous audio updates',
      duration_minutes: 30,
      priority: 'low',
      required_focus: 'medium',
      category: 'gentle_pace',
      due_date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      scheduled_time: '02:15 PM',
      order_index: 3,
      created_at: '2026-10-26T08:33:00Z',
    },
    {
      id: 'task_5',
      user_id: 'usr_default',
      title: 'Gentle Mindful Yoga',
      description: 'Restorative evening stretches for shoulder and spine ease',
      duration_minutes: 30,
      priority: 'medium',
      required_focus: 'low',
      category: 'nourish',
      due_date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      scheduled_time: '04:00 PM',
      order_index: 4,
      created_at: '2026-10-26T08:34:00Z',
    },
  ];

  private scheduleBlocks: ScheduleBlock[] = [];

  private notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      user_id: 'usr_default',
      category: 'ai',
      title: 'Energy Peak Ahead',
      message: 'Your afternoon mood is calm & focused. Perfect window for Gentle Mindful Yoga.',
      timestamp_text: '10m ago',
      read: false,
      action_label: 'Schedule Now',
      secondary_action_label: 'Later',
      icon_type: 'sparkle',
      badge_color: 'viridian',
    },
    {
      id: 'notif_2',
      user_id: 'usr_default',
      category: 'reminders',
      title: 'Asr Prayer & Reflection',
      message: 'Time for Asr tranquility. Take 5 mindful breaths and pause your tasks for peaceful dhikr.',
      timestamp_text: '45m ago',
      read: false,
      icon_type: 'moon',
      badge_color: 'sandstone',
    },
    {
      id: 'notif_3',
      user_id: 'usr_default',
      category: 'reminders',
      title: 'Hydration & Tea Break',
      message: 'Remember to drink warm chamomile tea and stretch your shoulders gently.',
      timestamp_text: '2h ago',
      read: false,
      icon_type: 'bell',
      badge_color: 'candy',
    },
    {
      id: 'notif_4',
      user_id: 'usr_default',
      category: 'moments',
      title: 'Weekly Harmony Summary',
      message: 'You completed 92% of your calm focus goals. Sync Buddy is cheering for you!',
      timestamp_text: 'Yesterday',
      read: true,
      icon_type: 'heart',
      badge_color: 'azur',
    },
  ];

  private chatMessages: ChatMessage[] = [
    {
      id: 'msg_1',
      user_id: 'usr_default',
      sender: 'buddy',
      text: 'Afternoon Maya 🌿 I noticed your energy check-in dropped a bit this afternoon. How are you holding up?',
      timestamp_text: '2:15 PM',
    },
    {
      id: 'msg_2',
      user_id: 'usr_default',
      sender: 'user',
      text: "I'm exhausted today",
      timestamp_text: '2:17 PM',
    },
    {
      id: 'msg_3',
      user_id: 'usr_default',
      sender: 'buddy',
      text: "I hear you completely. Rest is productive too. ☁️\n\nI've adjusted your afternoon so you don't have to stress:",
      timestamp_text: '2:18 PM',
      suggestions: {
        moved: '“Quarterly Roadmap Deck” → Tomorrow morning (10:00 AM)',
        kept: '“Warm Cinnamon Tea & 15m Nap” (Right now)',
        swapped: '“Client Sync” → Async voice note',
        chips: [
          { id: 'chip_confirm', label: 'Looks good, thank you ✨', action: 'accept' },
          { id: 'chip_modify', label: 'Change to 30m break', action: 'modify_break' },
        ],
      },
    },
  ];

  // User
  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(email: string): User {
    const existing = this.findUserByEmail(email);
    if (existing) return existing;
    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
    };
    this.users.push(user);
    this.createProfile(user.id, email.split('@')[0]);
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.find((u) => u.id === id) || this.users[0];
  }

  // Profile
  getProfile(userId: string): Profile {
    const p = this.profiles.find((p) => p.user_id === userId);
    return p || this.profiles[0];
  }

  updateProfile(userId: string, updates: Partial<Profile>): Profile {
    const prof = this.getProfile(userId);
    Object.assign(prof, updates);
    return prof;
  }

  private createProfile(userId: string, name: string): Profile {
    const profile: Profile = {
      id: `prof_${Date.now()}`,
      user_id: userId,
      display_name: name.charAt(0).toUpperCase() + name.slice(1),
      avatar_url: '/assets/aistudio/Image_1_c15772d0.jpeg',
      tagline: 'Mindful Rhythm • Serene Mode',
      timezone: 'Europe/London',
      ramadan_mode: true,
      prayer_location: 'London, UK',
      prayer_calculation: 'Hanafi calculation',
      notifications_enabled: true,
      theme: 'tactile_cozy',
      preferences: {
        working_hours_start: '09:00',
        working_hours_end: '18:00',
        break_length_minutes: 15,
        preferred_energy_times: {
          morning: 'high',
          afternoon: 'medium',
          evening: 'low',
        },
      },
    };
    this.profiles.push(profile);
    return profile;
  }

  // Mood Check-in
  createMoodCheckin(userId: string, data: { mood: MoodType; energy_level: number; focus_level: number; note?: string }): MoodCheckin {
    const checkin: MoodCheckin = {
      id: `chk_${Date.now()}`,
      user_id: userId,
      mood: data.mood,
      energy_level: data.energy_level,
      focus_level: data.focus_level,
      note: data.note,
      created_at: new Date().toISOString(),
    };
    this.moodCheckins.unshift(checkin);
    return checkin;
  }

  getLatestCheckin(userId: string): MoodCheckin | null {
    const list = this.moodCheckins.filter((c) => c.user_id === userId);
    return list[0] || this.moodCheckins[0] || null;
  }

  listMoodCheckins(userId: string, limit = 30): MoodCheckin[] {
    return this.moodCheckins.filter((c) => c.user_id === userId).slice(0, limit);
  }

  // Tasks
  listTasks(userId: string, filter?: { status?: string; due_date?: string }): Task[] {
    let result = this.tasks.filter((t) => t.user_id === userId);
    if (filter?.status) {
      result = result.filter((t) => t.status === filter.status);
    }
    if (filter?.due_date) {
      result = result.filter((t) => t.due_date === filter.due_date);
    }
    return result;
  }

  getTask(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  createTask(userId: string, taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'order_index'>): Task {
    const task: Task = {
      id: `task_${Date.now()}`,
      user_id: userId,
      order_index: this.tasks.length,
      created_at: new Date().toISOString(),
      ...taskData,
    };
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.getTask(id);
    if (!task) return undefined;
    Object.assign(task, updates);
    return task;
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  toggleTaskComplete(id: string): Task | undefined {
    const task = this.getTask(id);
    if (!task) return undefined;
    const isCompleted = task.status === 'completed';
    task.status = isCompleted ? 'pending' : 'completed';
    task.completed_at = !isCompleted ? new Date().toISOString() : undefined;
    return task;
  }

  // Schedule Blocks
  getScheduleBlocks(userId: string, date: string): ScheduleBlock[] {
    return this.scheduleBlocks.filter((b) => b.user_id === userId && b.date === date);
  }

  setScheduleBlocks(userId: string, date: string, blocks: ScheduleBlock[]): void {
    this.scheduleBlocks = this.scheduleBlocks.filter((b) => !(b.user_id === userId && b.date === date));
    this.scheduleBlocks.push(...blocks);
  }

  updateBlockStatus(blockId: string, status: 'accepted' | 'rejected'): ScheduleBlock | undefined {
    const block = this.scheduleBlocks.find((b) => b.id === blockId);
    if (block) {
      block.status = status;
    }
    return block;
  }

  moveBlock(blockId: string, startTime: string, endTime: string): ScheduleBlock | undefined {
    const block = this.scheduleBlocks.find((b) => b.id === blockId);
    if (block) {
      block.start_time = startTime;
      block.end_time = endTime;
      block.source = 'manual';
    }
    return block;
  }

  // Notifications
  listNotifications(userId: string, category?: string): NotificationItem[] {
    let list = this.notifications.filter((n) => n.user_id === userId);
    if (category && category !== 'all') {
      list = list.filter((n) => n.category === category);
    }
    return list;
  }

  markNotificationRead(id: string): NotificationItem | undefined {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    return notif;
  }

  // Chat
  listChatMessages(userId: string): ChatMessage[] {
    return this.chatMessages.filter((m) => m.user_id === userId);
  }

  addChatMessage(message: ChatMessage): void {
    this.chatMessages.push(message);
  }

  // Insights
  getInsights(userId: string, days = 7): InsightsData {
    const checkins = this.moodCheckins.slice(0, days);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const mood_trends = checkins.map((c) => {
      const d = new Date(c.created_at);
      return {
        date: c.created_at.slice(0, 10),
        day_name: dayNames[d.getDay()],
        mood: c.mood,
        energy_level: c.energy_level,
        focus_level: c.focus_level,
      };
    });

    const userTasks = this.tasks.filter((t) => t.user_id === userId);
    const completedTasks = userTasks.filter((t) => t.status === 'completed');
    const completion_rate = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 92;

    return {
      mood_trends,
      completion_rate: completion_rate || 92,
      completed_tasks_count: completedTasks.length || 11,
      total_tasks_count: userTasks.length || 12,
      best_focus_hours: [
        { hour: '09:00 - 11:00', label: 'Morning Peak Clarity', score: 94 },
        { hour: '14:00 - 15:30', label: 'Gentle Afternoon Sprint', score: 78 },
        { hour: '17:00 - 18:00', label: 'Dusk Wind-down & Reflection', score: 85 },
      ],
      weekly_harmony_score: 92,
    };
  }
}

export const store = new MemoryStore();
