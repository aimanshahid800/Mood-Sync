import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './src/repositories/store.ts';
import { generateSchedule } from './src/services/scheduler.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser
app.use(express.json());

// Request ID & Structured Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  res.setHeader('x-request-id', requestId as string);
  (req as any).requestId = requestId;

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/ready') {
      const sanitizedBody = req.body ? { ...req.body } : {};
      if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
      console.log(
        JSON.stringify({
          time: new Date().toISOString(),
          requestId,
          method: req.method,
          path: req.path,
          status: res.statusCode,
          durationMs: duration,
        })
      );
    }
  });
  next();
});

// Simple in-memory rate limiter for auth & check-ins
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function rateLimiter(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'local';
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + windowMs;
    } else {
      entry.count += 1;
    }
    rateLimitMap.set(ip, entry);

    if (entry.count > limit) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please take a mindful pause.',
        },
      });
    }
    next();
  };
}

// Auth mock middleware (extracts user token or uses default user)
function getUserId(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer usr_')) {
    return authHeader.replace('Bearer ', '');
  }
  return 'usr_default';
}

// -----------------------------------------------------------------------------
// Health & Readiness Endpoints
// -----------------------------------------------------------------------------
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/ready', (_req: Request, res: Response) => {
  res.json({ status: 'ready', timestamp: new Date().toISOString() });
});

// -----------------------------------------------------------------------------
// REST API v1
// -----------------------------------------------------------------------------
const api = express.Router();

// Auth Endpoints
api.post('/auth/signup', rateLimiter(15, 60000), (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      error: { code: 'INVALID_EMAIL', message: 'Please provide a valid email address.' },
    });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters.' },
    });
  }

  const user = store.createUser(email);
  const profile = store.getProfile(user.id);
  res.status(201).json({
    data: {
      user,
      profile,
      token: `Bearer ${user.id}`,
    },
  });
});

api.post('/auth/login', rateLimiter(20, 60000), (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: { code: 'MISSING_CREDENTIALS', message: 'Email and password are required.' },
    });
  }
  let user = store.findUserByEmail(email);
  if (!user) {
    // If not found, gentle fallback creates account or accepts demo
    user = store.createUser(email);
  }
  const profile = store.getProfile(user.id);
  res.json({
    data: {
      user,
      profile,
      token: `Bearer ${user.id}`,
    },
  });
});

api.post('/auth/google', (req: Request, res: Response) => {
  const email = req.body.email || 'maya@mindfulday.com';
  const user = store.createUser(email);
  const profile = store.getProfile(user.id);
  res.json({
    data: {
      user,
      profile,
      token: `Bearer ${user.id}`,
    },
  });
});

api.post('/auth/logout', (_req: Request, res: Response) => {
  res.json({ data: { message: 'Successfully logged out. Rest peacefully.' } });
});

api.get('/auth/me', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const user = store.getUser(userId) || store.getUser('usr_default');
  const profile = store.getProfile(userId);
  res.json({ data: { user, profile } });
});

// Profile Endpoints
api.get('/profile', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const profile = store.getProfile(userId);
  res.json({ data: profile });
});

api.put('/profile', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const updated = store.updateProfile(userId, req.body);
  res.json({ data: updated });
});

// Mood Check-in Endpoints
api.post('/mood-checkins', rateLimiter(30, 60000), (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { mood, energy_level, focus_level, note } = req.body;

  if (!mood || !energy_level) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Mood and energy level (1-5) are required.' },
    });
  }

  const checkin = store.createMoodCheckin(userId, {
    mood,
    energy_level: Number(energy_level),
    focus_level: Number(focus_level || energy_level),
    note,
  });

  // Automatically trigger schedule re-tune for today
  const today = new Date().toISOString().slice(0, 10);
  const tasks = store.listTasks(userId);
  const profile = store.getProfile(userId);
  const generated = generateSchedule({
    date: today,
    userId,
    tasks,
    latestCheckin: checkin,
    preferences: profile.preferences,
  });
  store.setScheduleBlocks(userId, today, generated.scheduleBlocks);

  res.status(201).json({
    data: {
      checkin,
      paceNote: generated.paceNote,
      scheduleBlocksCount: generated.scheduleBlocks.length,
    },
  });
});

api.get('/mood-checkins', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const limit = Number(req.query.limit) || 30;
  const checkins = store.listMoodCheckins(userId, limit);
  res.json({ data: checkins });
});

api.get('/mood-checkins/latest', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const latest = store.getLatestCheckin(userId);
  res.json({ data: latest });
});

// Tasks Endpoints
api.get('/tasks', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const status = req.query.status as string | undefined;
  const dueDate = req.query.due_date as string | undefined;
  const tasks = store.listTasks(userId, { status, due_date: dueDate });
  res.json({ data: tasks });
});

api.post('/tasks', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { title, description, duration_minutes, priority, required_focus, category, due_date, scheduled_time } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: { code: 'EMPTY_TITLE', message: 'Task title is required.' },
    });
  }

  const task = store.createTask(userId, {
    title: title.trim(),
    description: description || '',
    duration_minutes: Number(duration_minutes) || 30,
    priority: priority || 'medium',
    required_focus: required_focus || 'medium',
    category: category || 'general',
    due_date: due_date || new Date().toISOString().slice(0, 10),
    status: 'pending',
    scheduled_time: scheduled_time || '4:00 PM',
  });

  res.status(201).json({ data: task });
});

api.get('/tasks/:id', (req: Request, res: Response) => {
  const task = store.getTask(req.params.id);
  if (!task) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Task not found.' },
    });
  }
  res.json({ data: task });
});

api.put('/tasks/:id', (req: Request, res: Response) => {
  const task = store.updateTask(req.params.id, req.body);
  if (!task) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Task not found.' },
    });
  }
  res.json({ data: task });
});

api.delete('/tasks/:id', (req: Request, res: Response) => {
  const success = store.deleteTask(req.params.id);
  if (!success) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Task not found.' },
    });
  }
  res.json({ data: { message: 'Task removed peacefully.' } });
});

api.patch('/tasks/:id/complete', (req: Request, res: Response) => {
  const task = store.toggleTaskComplete(req.params.id);
  if (!task) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Task not found.' },
    });
  }
  res.json({ data: task });
});

// Schedule Endpoints
api.get('/schedule', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
  let blocks = store.getScheduleBlocks(userId, date);

  // If no blocks generated yet, auto-generate from current tasks and mood
  if (blocks.length === 0) {
    const tasks = store.listTasks(userId);
    const checkin = store.getLatestCheckin(userId);
    const profile = store.getProfile(userId);
    const generated = generateSchedule({
      date,
      userId,
      tasks,
      latestCheckin: checkin,
      preferences: profile.preferences,
    });
    store.setScheduleBlocks(userId, date, generated.scheduleBlocks);
    blocks = generated.scheduleBlocks;
  }

  res.json({ data: blocks });
});

api.post('/schedule/generate', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const date = req.body.date || new Date().toISOString().slice(0, 10);
  const tasks = store.listTasks(userId);
  const checkin = store.getLatestCheckin(userId);
  const profile = store.getProfile(userId);

  const result = generateSchedule({
    date,
    userId,
    tasks,
    latestCheckin: checkin,
    preferences: profile.preferences,
  });

  store.setScheduleBlocks(userId, date, result.scheduleBlocks);
  res.json({ data: result });
});

api.patch('/schedule/blocks/:id/accept', (req: Request, res: Response) => {
  const block = store.updateBlockStatus(req.params.id, 'accepted');
  if (!block) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Schedule block not found.' },
    });
  }
  res.json({ data: block });
});

api.patch('/schedule/blocks/:id/reject', (req: Request, res: Response) => {
  const block = store.updateBlockStatus(req.params.id, 'rejected');
  if (!block) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Schedule block not found.' },
    });
  }
  res.json({ data: block });
});

api.patch('/schedule/blocks/:id/move', (req: Request, res: Response) => {
  const { start_time, end_time } = req.body;
  if (!start_time || !end_time) {
    return res.status(400).json({
      error: { code: 'INVALID_TIMES', message: 'start_time and end_time are required.' },
    });
  }
  const block = store.moveBlock(req.params.id, start_time, end_time);
  if (!block) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Schedule block not found.' },
    });
  }
  res.json({ data: block });
});

// Insights Endpoints
api.get('/insights', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const days = Number(req.query.days) || 7;
  const insights = store.getInsights(userId, days);
  res.json({ data: insights });
});

// Notifications Endpoints
api.get('/notifications', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const category = req.query.category as string | undefined;
  const notifications = store.listNotifications(userId, category);
  res.json({ data: notifications });
});

api.patch('/notifications/:id/read', (req: Request, res: Response) => {
  const item = store.markNotificationRead(req.params.id);
  if (!item) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Notification not found.' },
    });
  }
  res.json({ data: item });
});

// Sync Buddy Chat Endpoints
api.get('/buddy/messages', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const messages = store.listChatMessages(userId);
  res.json({ data: messages });
});

api.post('/buddy/chat', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const text = (req.body.text || '').trim();
  if (!text) {
    return res.status(400).json({
      error: { code: 'EMPTY_MESSAGE', message: 'Please enter a message for Sync Buddy.' },
    });
  }

  // Record user message
  const userMsg = {
    id: `msg_${Date.now()}`,
    user_id: userId,
    sender: 'user' as const,
    text,
    timestamp_text: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  store.addChatMessage(userMsg);

  // Generate empathetic response
  let replyText = "I'm listening gently. How can I adjust your day so you feel supported?";
  let suggestions = undefined;

  const lower = text.toLowerCase();
  if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('low') || lower.includes('stress')) {
    replyText = "I hear you completely. Rest is productive too. ☁️\nI've softened your schedule so you don't have to stress:";
    suggestions = {
      moved: '“Quarterly Roadmap Deck” → Tomorrow morning (10:00 AM)',
      kept: '“Warm Cinnamon Tea & 15m Nap” (Right now)',
      swapped: '“Client Sync” → Async voice note',
      chips: [
        { id: 'chip_confirm', label: 'Looks good, thank you ✨', action: 'accept' },
        { id: 'chip_modify', label: 'Change to 30m break', action: 'modify_break' },
      ],
    };
  } else if (lower.includes('break') || lower.includes('tea') || lower.includes('pause')) {
    replyText = "Tea pause locked in! 🫖 Breathing deep and stepping away from screens is essential rhythm maintenance.";
  } else if (lower.includes('energy') || lower.includes('ready') || lower.includes('focus')) {
    replyText = "Love that clarity! ☀️ I've aligned your top deep focus tasks to make the most of this high-momentum window.";
  }

  const buddyMsg = {
    id: `msg_${Date.now() + 1}`,
    user_id: userId,
    sender: 'buddy' as const,
    text: replyText,
    timestamp_text: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions,
  };
  store.addChatMessage(buddyMsg);

  res.json({
    data: {
      userMessage: userMsg,
      buddyReply: buddyMsg,
    },
  });
});

app.use('/api/v1', api);

// -----------------------------------------------------------------------------
// Dev & Production Serving
// -----------------------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MoodSync fullstack app running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
