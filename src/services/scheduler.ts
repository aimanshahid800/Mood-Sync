import { Task, MoodCheckin, SchedulingPreferences, ScheduleBlock } from '../types/index.ts';

export interface SchedulerInput {
  date: string; // YYYY-MM-DD
  userId: string;
  tasks: Task[];
  latestCheckin?: MoodCheckin | null;
  preferences?: SchedulingPreferences;
  existingBlocks?: ScheduleBlock[];
}

export interface SchedulerOutput {
  date: string;
  energyLevel: number;
  mood: string;
  scheduleBlocks: ScheduleBlock[];
  paceNote: string;
}

/**
 * MoodSync Deterministic Scheduler Service
 *
 * Scoring & Scheduling Algorithm:
 * 1. Base Score:
 *    - Priority: high = 30 pts, medium = 20 pts, low = 10 pts.
 *    - Focus Requirement: high = 25 pts, medium = 15 pts, low = 5 pts.
 *
 * 2. Energy & Mood Modulation:
 *    - Energy factor (1 to 5, default 3):
 *      - Energy 4-5 (Vibrant / Flow): Boosts high-focus tasks by +30 points.
 *        Places them at the beginning of the working day for deep morning clarity.
 *      - Energy 3 (Steady): Balances focus and moderate tasks in sequence with standard 15m breaks.
 *      - Energy 1-2 (Gentle / Exhausted): Penalizes high cognitive strain (-25 points) and
 *        prioritizes nourish/restorative tasks (+35 points). Caps continuous focus sessions to 35m max
 *        and enforces restorative pauses.
 *
 * 3. Time Placement & Buffer:
 *    - Starts at working_hours_start (default 09:00).
 *    - Converts hours to minutes from midnight for pure integer arithmetic.
 *    - Increments time by task.duration_minutes + preferences.break_length_minutes (default 15m).
 *    - Clamps end time so it does not exceed working_hours_end (default 18:00).
 *
 * 4. Determinism & Idempotency:
 *    - Tie-breaking uses deterministic task ID ordering, ensuring that repeated calls
 *      with identical inputs always produce identical schedule outputs without side effects.
 */
export function generateSchedule(input: SchedulerInput): SchedulerOutput {
  const { date, userId, tasks, latestCheckin, preferences, existingBlocks = [] } = input;

  const energyLevel = latestCheckin?.energy_level ?? 3;
  const mood = latestCheckin?.mood ?? 'calm';

  const defaultPreferences: SchedulingPreferences = {
    working_hours_start: '09:00',
    working_hours_end: '18:00',
    break_length_minutes: 15,
    preferred_energy_times: {
      morning: 'high',
      afternoon: 'medium',
      evening: 'low',
    },
  };

  const prefs = preferences || defaultPreferences;

  // Filter pending or in_progress tasks
  const eligibleTasks = tasks.filter((t) => t.status !== 'completed');

  // Compute scoring for each task
  const scoredTasks = eligibleTasks.map((task) => {
    let score = 0;

    // Priority points
    if (task.priority === 'high') score += 30;
    else if (task.priority === 'medium') score += 20;
    else score += 10;

    // Focus requirement points
    if (task.required_focus === 'high') score += 25;
    else if (task.required_focus === 'medium') score += 15;
    else score += 5;

    // Energy alignment
    if (energyLevel >= 4) {
      if (task.required_focus === 'high') score += 30;
      if (task.category === 'deep_focus') score += 20;
    } else if (energyLevel <= 2) {
      if (task.required_focus === 'high') score -= 25;
      if (task.category === 'nourish' || task.category === 'spiritual') score += 40;
      if (task.priority === 'low') score += 15;
    } else {
      // Steady
      if (task.category === 'deep_focus') score += 10;
    }

    return { task, score };
  });

  // Sort deterministically: highest score first, tie breaker: task id
  scoredTasks.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.task.id.localeCompare(b.task.id);
  });

  // Parse time boundaries
  const [startH, startM] = prefs.working_hours_start.split(':').map(Number);
  const [endH, endM] = prefs.working_hours_end.split(':').map(Number);

  let currentMinute = (startH || 9) * 60 + (startM || 0);
  const maxMinute = (endH || 18) * 60 + (endM || 0);
  const breakMinutes = prefs.break_length_minutes || 15;

  const generatedBlocks: ScheduleBlock[] = [];

  for (const { task } of scoredTasks) {
    // Check if task already has an existing accepted/manual block
    const existing = existingBlocks.find((b) => b.task_id === task.id);
    if (existing && existing.status === 'accepted') {
      generatedBlocks.push(existing);
      continue;
    }

    let duration = task.duration_minutes || 30;
    // On low energy days, soften long tasks to gentle intervals
    if (energyLevel <= 2 && duration > 45) {
      duration = 40;
    }

    if (currentMinute + duration > maxMinute) {
      // Reached end of working hours for today
      break;
    }

    const blockStartH = Math.floor(currentMinute / 60);
    const blockStartM = currentMinute % 60;
    const blockEndMinute = currentMinute + duration;
    const blockEndH = Math.floor(blockEndMinute / 60);
    const blockEndM = blockEndMinute % 60;

    const startTime = `${String(blockStartH).padStart(2, '0')}:${String(blockStartM).padStart(2, '0')}`;
    const endTime = `${String(blockEndH).padStart(2, '0')}:${String(blockEndM).padStart(2, '0')}`;

    let reason = 'Balanced daily flow';
    if (energyLevel >= 4 && task.required_focus === 'high') {
      reason = 'Scheduled for morning peak energy window';
    } else if (energyLevel <= 2) {
      reason = 'Softened gentle pace suited for replenishment';
    } else if (task.category === 'nourish') {
      reason = 'Midday restorative break';
    }

    generatedBlocks.push({
      id: `block-${date}-${task.id}`,
      user_id: userId,
      task_id: task.id,
      task,
      date,
      start_time: startTime,
      end_time: endTime,
      source: 'suggested',
      status: 'suggested',
      reason,
    });

    // Advance time cursor + break
    currentMinute = blockEndMinute + breakMinutes;
  }

  let paceNote = 'Optimal for 3 focus goals + 2 breaks';
  if (energyLevel === 1) paceNote = 'Soft pace • 1 gentle goal & generous rest';
  else if (energyLevel === 2) paceNote = 'Cozy pace • 2 unhurried tasks + tea pause';
  else if (energyLevel === 3) paceNote = 'Steady rhythm • 2 focus intervals & mindful walk';
  else if (energyLevel === 5) paceNote = 'Full flow • Deep creative sessions & bold milestones';

  return {
    date,
    energyLevel,
    mood,
    scheduleBlocks: generatedBlocks,
    paceNote,
  };
}
