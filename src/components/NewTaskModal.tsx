import React, { useState } from 'react';
import { TaskPriority, TaskRequiredFocus } from '../types/index.ts';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description?: string;
    duration_minutes: number;
    priority: TaskPriority;
    required_focus: TaskRequiredFocus;
    category: 'deep_focus' | 'nourish' | 'spiritual' | 'gentle_pace' | 'general';
    scheduled_time: string;
    due_date: string;
  }) => Promise<void>;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [taskName, setTaskName] = useState('Gentle Mindful Yoga');
  const [scheduledDate] = useState('Today, Oct 27');
  const [scheduledTime, setScheduledTime] = useState('4:00 PM');
  const [energyPriority, setEnergyPriority] = useState<TaskPriority>('medium');
  const [duration, setDuration] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setErrorMsg('Please enter a task name.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      let category: 'deep_focus' | 'nourish' | 'spiritual' | 'gentle_pace' | 'general' = 'general';
      const lower = taskName.toLowerCase();
      if (lower.includes('yoga') || lower.includes('tea') || lower.includes('walk') || lower.includes('nap')) {
        category = 'nourish';
      } else if (lower.includes('prayer') || lower.includes('dhikr') || lower.includes('reflect')) {
        category = 'spiritual';
      } else if (energyPriority === 'high') {
        category = 'deep_focus';
      } else {
        category = 'gentle_pace';
      }

      await onSubmit({
        title: taskName.trim(),
        description: 'Tuned gently with MoodSync',
        duration_minutes: duration,
        priority: energyPriority,
        required_focus: energyPriority === 'high' ? 'high' : energyPriority === 'medium' ? 'medium' : 'low',
        category,
        scheduled_time: scheduledTime,
        due_date: new Date().toISOString().slice(0, 10),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to add task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add new task"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-[390px] h-full sm:h-[844px] bg-[#E78299] flex flex-col justify-between overflow-hidden shadow-2xl sm:rounded-[44px] text-[#2D2833]">
        {/* Subtle warm ambient shapes */}
        <div className="absolute -top-12 -right-10 w-44 h-44 rounded-full bg-[#f095ab] opacity-50 pointer-events-none" />
        <div className="absolute top-44 -left-12 w-32 h-32 rounded-full bg-[#de7289] opacity-40 pointer-events-none" />
        <div className="absolute bottom-28 -right-8 w-36 h-36 rounded-full bg-[#f39cb0] opacity-45 pointer-events-none" />

        {/* Top iOS Status Bar */}
        <div className="w-full pt-3 px-7 flex justify-between items-center z-20 text-white font-semibold text-xs tracking-wider">
          <span>9:41</span>
          <div className="flex items-center space-x-1.5">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.58 10.58 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
            </svg>
            <div className="w-5 h-2.5 border-2 border-white rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-xs" />
            </div>
          </div>
        </div>

        {/* Top App Bar / Header */}
        <header className="px-6 pt-2 pb-3 flex items-center justify-between z-20">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all flex items-center justify-center text-white"
          >
            <svg className="w-5 h-5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">New Task</h1>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
            <span className="text-base">✨</span>
          </div>
        </header>

        {/* Main Content Card Container */}
        <main className="flex-1 px-5 pb-6 z-10 overflow-y-auto flex flex-col justify-start">
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFDF9] rounded-[32px] p-5 shadow-card flex flex-col gap-3.5 border border-[#fff1f4]"
          >
            {errorMsg && (
              <div className="p-2 bg-red-100 text-red-700 text-xs font-bold rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {/* Task Name Input Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#71626A] tracking-wide uppercase px-1">
                Task Name
              </label>
              <div className="bg-[#FFF5F7] border-2 border-[#FBD6DF] rounded-full px-4 py-3 flex items-center gap-2.5 transition-all focus-within:border-[#E78299] focus-within:bg-white">
                <svg
                  className="w-5 h-5 text-[#E78299] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="What would you like to do?"
                  className="bg-transparent w-full text-[#3D343A] placeholder-[#71626A]/50 text-sm font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Scheduled Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#71626A] tracking-wide uppercase px-1">
                Scheduled Time
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Date Pill */}
                <div className="bg-[#FFF5F7] border-2 border-[#FBD6DF] rounded-full px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-4 h-4 text-[#877499]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                      <rect x="3" y="4" width="18" height="18" rx="3" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-xs font-bold text-[#3D343A] truncate">{scheduledDate}</span>
                  </div>
                </div>

                {/* Time Pill */}
                <div className="bg-[#FFF5F7] border-2 border-[#FBD6DF] rounded-full px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-4 h-4 text-[#877499]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="9" />
                      <polyline points="12 7 12 12 15 15" />
                    </svg>
                    <input
                      type="text"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="text-xs font-bold text-[#3D343A] bg-transparent w-16 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-[#71626A] tracking-wide uppercase">
                  Duration
                </label>
                <span className="text-[11px] font-semibold text-[#877499]">{duration} minutes</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2 rounded-2xl font-bold text-xs border-2 transition-all ${
                      duration === mins
                        ? 'bg-[#877499] text-white border-[#877499]'
                        : 'bg-[#FFF5F7] border-[#FBD6DF] text-[#71626A]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-[#71626A] tracking-wide uppercase">
                  Energy &amp; Priority
                </label>
                <span className="text-[11px] font-semibold text-[#877499]">
                  {energyPriority === 'high' ? 'High Effort' : energyPriority === 'medium' ? 'Medium Effort' : 'Gentle Effort'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Low Chip */}
                <button
                  type="button"
                  onClick={() => setEnergyPriority('low')}
                  className={`py-2 px-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all border-2 ${
                    energyPriority === 'low'
                      ? 'bg-[#E78299] text-white border-[#E78299]'
                      : 'bg-[#FFF5F7] border-[#FBD6DF] text-[#71626A]'
                  }`}
                >
                  <span className="text-sm">🌱</span>
                  <span>Low</span>
                </button>

                {/* Medium Chip */}
                <button
                  type="button"
                  onClick={() => setEnergyPriority('medium')}
                  className={`py-2 px-3 rounded-2xl font-extrabold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all border-2 ${
                    energyPriority === 'medium'
                      ? 'bg-[#E78299] text-white border-[#E78299] shadow-sm'
                      : 'bg-[#FFF5F7] border-[#FBD6DF] text-[#71626A]'
                  }`}
                >
                  <span className="text-sm">✨</span>
                  <span>Medium</span>
                </button>

                {/* High Chip */}
                <button
                  type="button"
                  onClick={() => setEnergyPriority('high')}
                  className={`py-2 px-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all border-2 ${
                    energyPriority === 'high'
                      ? 'bg-[#E78299] text-white border-[#E78299]'
                      : 'bg-[#FFF5F7] border-[#FBD6DF] text-[#71626A]'
                  }`}
                >
                  <span className="text-sm">🔥</span>
                  <span>High</span>
                </button>
              </div>
            </div>

            {/* Highlighted AI Suggestion Box */}
            <div className="bg-[#E6D4BF] rounded-2xl p-3 flex items-start gap-2.5 border border-[#d9c4ad] text-[#3D343A]">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#877499] shadow-sm">
                <svg className="w-4 h-4 fill-current text-[#877499]" viewBox="0 0 24 24">
                  <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#877499]">
                    MoodSync AI Tune
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#679F9F] inline-block" />
                </div>
                <p className="text-xs font-bold text-[#3D343A] leading-snug">
                  Suggested time based on your mood:{' '}
                  <span className="text-[#877499] font-extrabold underline decoration-[#E78299] decoration-2">
                    {scheduledTime}
                  </span>
                </p>
                <p className="text-[10px] font-semibold text-[#71626A] mt-0.5 leading-tight">
                  Your afternoon energy shows calm focus, ideal for gentle replenishment.
                </p>
              </div>
            </div>

            {/* Add Task Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-[#877499] hover:bg-[#786689] active:scale-[0.98] transition-all text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-raised mt-1 disabled:opacity-50"
            >
              <svg className="w-5 h-5 stroke-white fill-none stroke-[3]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>{submitting ? 'Adding...' : 'Add Task'}</span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
