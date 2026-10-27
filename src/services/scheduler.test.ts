import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSchedule } from './scheduler.ts';
import { Task, MoodCheckin, SchedulingPreferences } from '../types/index.ts';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    user_id: 'user-1',
    title: 'Review Complex Architecture RFC',
    description: 'Deep technical read and design system breakdown',
    duration_minutes: 45,
    priority: 'high',
    required_focus: 'high',
    category: 'deep_focus',
    due_date: '2026-10-27',
    status: 'pending',
    order_index: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    user_id: 'user-1',
    title: 'Warm Chamomile Tea & Mindful Walk',
    description: 'Gentle hydration and posture reset',
    duration_minutes: 15,
    priority: 'low',
    required_focus: 'low',
    category: 'nourish',
    due_date: '2026-10-27',
    status: 'pending',
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    user_id: 'user-1',
    title: 'Quick Team Voice Note Updates',
    description: 'Async standup check-in',
    duration_minutes: 20,
    priority: 'medium',
    required_focus: 'medium',
    category: 'gentle_pace',
    due_date: '2026-10-27',
    status: 'pending',
    order_index: 2,
    created_at: new Date().toISOString(),
  },
];

const mockPreferences: SchedulingPreferences = {
  working_hours_start: '09:00',
  working_hours_end: '18:00',
  break_length_minutes: 15,
  preferred_energy_times: {
    morning: 'high',
    afternoon: 'medium',
    evening: 'low',
  },
};

test('Scheduler places high-focus task first when energy is high (4/5)', () => {
  const highEnergyCheckin: MoodCheckin = {
    id: 'checkin-1',
    user_id: 'user-1',
    mood: 'energetic',
    energy_level: 5,
    focus_level: 5,
    created_at: new Date().toISOString(),
  };

  const result = generateSchedule({
    date: '2026-10-27',
    userId: 'user-1',
    tasks: mockTasks,
    latestCheckin: highEnergyCheckin,
    preferences: mockPreferences,
  });

  assert.equal(result.scheduleBlocks.length, 3);
  // High focus task should be placed first
  assert.equal(result.scheduleBlocks[0].task_id, 'task-1');
  assert.equal(result.scheduleBlocks[0].start_time, '09:00');
  assert.equal(result.scheduleBlocks[0].end_time, '09:45');
  // Next task should start after the 15-minute break at 10:00
  assert.equal(result.scheduleBlocks[1].start_time, '10:00');
});

test('Scheduler prioritizes nourish / restorative task when energy is low (2/5)', () => {
  const lowEnergyCheckin: MoodCheckin = {
    id: 'checkin-2',
    user_id: 'user-1',
    mood: 'tired',
    energy_level: 2,
    focus_level: 2,
    created_at: new Date().toISOString(),
  };

  const result = generateSchedule({
    date: '2026-10-27',
    userId: 'user-1',
    tasks: mockTasks,
    latestCheckin: lowEnergyCheckin,
    preferences: mockPreferences,
  });

  // Nourish task should be boosted ahead of heavy cognitive tasks
  assert.equal(result.scheduleBlocks[0].task_id, 'task-2');
  assert.equal(result.paceNote.includes('Cozy pace'), true);
});

test('Scheduler is idempotent: repeated calls with same inputs yield identical blocks', () => {
  const checkin: MoodCheckin = {
    id: 'checkin-3',
    user_id: 'user-1',
    mood: 'happy',
    energy_level: 4,
    focus_level: 4,
    created_at: new Date().toISOString(),
  };

  const run1 = generateSchedule({
    date: '2026-10-27',
    userId: 'user-1',
    tasks: mockTasks,
    latestCheckin: checkin,
    preferences: mockPreferences,
  });

  const run2 = generateSchedule({
    date: '2026-10-27',
    userId: 'user-1',
    tasks: mockTasks,
    latestCheckin: checkin,
    preferences: mockPreferences,
  });

  assert.deepEqual(run1.scheduleBlocks, run2.scheduleBlocks);
});

test('Scheduler respects working hours limit and excludes completed tasks', () => {
  const tasksWithCompleted: Task[] = [
    ...mockTasks,
    {
      id: 'task-completed',
      user_id: 'user-1',
      title: 'Done task',
      description: 'Already finished',
      duration_minutes: 30,
      priority: 'high',
      required_focus: 'high',
      category: 'deep_focus',
      due_date: '2026-10-27',
      status: 'completed',
      order_index: 99,
      created_at: new Date().toISOString(),
    },
  ];

  const result = generateSchedule({
    date: '2026-10-27',
    userId: 'user-1',
    tasks: tasksWithCompleted,
    latestCheckin: null,
    preferences: mockPreferences,
  });

  assert.equal(result.scheduleBlocks.some((b) => b.task_id === 'task-completed'), false);
});
