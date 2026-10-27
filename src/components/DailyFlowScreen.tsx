import React, { useState } from 'react';
import { Task, MoodCheckin, Profile } from '../types/index.ts';

interface DailyFlowScreenProps {
  tasks: Task[];
  latestCheckin: MoodCheckin | null;
  profile: Profile | null;
  onToggleTask: (taskId: string) => void;
  onOpenCheckin: () => void;
  onOpenAddTask: () => void;
  onOpenInsights: () => void;
  onReorderTasks?: () => void;
  isLoading?: boolean;
}

export const DailyFlowScreen: React.FC<DailyFlowScreenProps> = ({
  tasks,
  latestCheckin,
  profile,
  onToggleTask,
  onOpenCheckin,
  onOpenAddTask,
  onOpenInsights,
  isLoading = false,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Fallback info
  const displayName = profile?.display_name || 'Amina';
  const mood = latestCheckin?.mood || 'happy';
  const energyLevel = latestCheckin?.energy_level ?? 4;

  const moodEmojis: Record<string, string> = {
    energetic: '⚡',
    happy: '☀️',
    calm: '🌿',
    tired: '☁️',
    low: '🌧️',
  };

  const moodLabels: Record<string, string> = {
    energetic: 'Vibrant',
    happy: 'Joyful',
    calm: 'Serene',
    tired: 'Gentle',
    low: 'Soft',
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;

  return (
    <div className="relative w-full min-h-screen bg-[#679F9F] text-[#2D2833] flex flex-col justify-between overflow-x-hidden selection:bg-[#E78299] selection:text-white">
      {/* Decorative ambient blobs */}
      <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-[#7CAFAF] opacity-50 pointer-events-none" />
      <div className="absolute top-64 -left-16 w-48 h-48 rounded-full bg-[#568D8D] opacity-40 pointer-events-none" />
      <div className="absolute bottom-40 -right-10 w-40 h-40 rounded-full bg-[#E78299] opacity-20 pointer-events-none" />

      {/* Top iOS Status Bar */}
      <div className="relative z-20 pt-3 px-7 flex justify-between items-center text-white text-xs font-semibold tracking-wide">
        <span>9:41</span>
        <div className="flex items-center space-x-1.5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.58 10.58 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
          </svg>
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z" />
          </svg>
          <div className="w-5 h-2.5 border-2 border-white rounded-sm p-0.5 flex items-center">
            <div className="w-full h-full bg-white rounded-xs" />
          </div>
        </div>
      </div>

      {/* App Bar / Header */}
      <header className="relative z-20 px-6 pt-2 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onOpenCheckin}
          aria-label="Daily mood check-in"
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all flex items-center justify-center text-white shadow-sm"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        <h1 className="text-xl font-extrabold text-white tracking-tight">Daily Flow</h1>

        <button
          type="button"
          onClick={onOpenInsights}
          aria-label="View mindful insights"
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition-all flex items-center justify-center text-white shadow-sm"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 px-5 pt-2 pb-36 overflow-y-auto space-y-4">
        {/* Morning Greeting & Mood Token */}
        <section className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[#E6F7F7]">
                <span className="text-[#FFF2E0] text-sm">✨</span>
                <span className="text-[11px] font-bold text-[#E6F7F7] uppercase tracking-wider">
                  Morning Harmony
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
                Good morning, {displayName}
              </h2>
            </div>

            {/* Clickable Mood Token Pill */}
            <button
              type="button"
              onClick={onOpenCheckin}
              aria-label="Current feeling token, tap to update"
              className="bg-[#FFFDF9] rounded-full px-3 py-1.5 flex items-center gap-2 shadow-cozy-card active:scale-95 transition-transform"
            >
              <span className="w-7 h-7 rounded-full bg-[#FFD9DF] flex items-center justify-center text-sm">
                {moodEmojis[mood] || '☀️'}
              </span>
              <div className="flex flex-col text-left pr-1">
                <span className="text-xs font-bold text-[#231A0D] leading-tight">
                  {moodLabels[mood] || 'Joyful'}
                </span>
                <span className="text-[10px] text-[#2E6767] font-semibold leading-none">
                  {energyLevel}/5 Energy
                </span>
              </div>
            </button>
          </div>

          <p className="text-xs text-[#E6F7F7] font-medium">
            Let's move through the day with gentle, unhurried pace.
          </p>
        </section>

        {/* Mindful Pause / Prayer Card */}
        {profile?.ramadan_mode !== false && (
          <section className="w-full bg-[#2E6767] rounded-[24px] p-4 text-white shadow-cozy relative overflow-hidden border border-[#3E7B7B]">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#B3EDED]/20 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10 mb-2">
              <div className="flex items-center gap-1.5 bg-[#B3EDED]/25 px-2.5 py-1 rounded-full">
                <svg className="w-3.5 h-3.5 fill-[#B3EDED]" viewBox="0 0 24 24">
                  <path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 10.9-10.9A10 10 0 0 1 12.3 2z" />
                </svg>
                <span className="text-[11px] font-bold text-white tracking-wide">Next Pause</span>
              </div>
              <span className="text-xs bg-[#FFFDF9] text-[#2E6767] px-3 py-0.5 rounded-full font-extrabold shadow-sm">
                12:45 PM
              </span>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-lg font-bold text-white">Dhuhr Prayer & Stillness</h3>
                <p className="text-xs text-[#B3EDED] mt-0.5 font-medium">
                  Next: in 1h 24m • A peaceful pause for reflection
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#B3EDED]/20 flex items-center justify-center text-white shadow-inner">
                <span className="text-xl">🕌</span>
              </div>
            </div>

            {/* Cozy progress bar */}
            <div className="mt-3 relative z-10">
              <div className="w-full h-2 bg-[#B3EDED]/20 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-[#B3EDED] rounded-full w-[65%] transition-all duration-500" />
              </div>
              <div className="flex justify-between items-center mt-1 text-[#98D1D1] text-[10px] font-semibold">
                <span>Fajr (Completed)</span>
                <span>Asr (04:12 PM)</span>
              </div>
            </div>
          </section>
        )}

        {/* Today's Tasks Section */}
        <section className="flex flex-col space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Today's Tasks</h3>
              <span className="w-2 h-2 rounded-full bg-[#E78299]" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFFDF9] text-[#2E6767] shadow-sm">
              {completedCount} of {totalCount} tuned
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2 py-4">
              <div className="h-16 bg-white/20 rounded-2xl animate-pulse" />
              <div className="h-16 bg-white/20 rounded-2xl animate-pulse" />
              <div className="h-16 bg-white/20 rounded-2xl animate-pulse" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-[#FFFDF9] rounded-2xl p-6 text-center shadow-cozy-card">
              <span className="text-3xl">🌸</span>
              <h4 className="text-sm font-bold text-[#231A0D] mt-2">No tasks scheduled</h4>
              <p className="text-xs text-[#71626A] mt-1">Your day is open and serene.</p>
              <button
                type="button"
                onClick={onOpenAddTask}
                className="mt-3 px-4 py-2 bg-[#877499] text-white text-xs font-bold rounded-full shadow-sm"
              >
                + Add Gentle Task
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {tasks.map((task) => {
                const isCompleted = task.status === 'completed';

                let accentBg = 'bg-[#665578]';
                let tagBg = 'bg-[#EFDBFF] text-[#231434]';
                let tagLabel = 'Deep Focus';

                if (task.category === 'nourish') {
                  accentBg = 'bg-[#954056]';
                  tagBg = 'bg-[#FFD9DF] text-[#7A2B41]';
                  tagLabel = 'Nourish';
                } else if (task.category === 'spiritual') {
                  accentBg = 'bg-[#2E6767]';
                  tagBg = 'bg-[#B3EDED] text-[#0F4F4F]';
                  tagLabel = 'Spiritual';
                } else if (task.category === 'gentle_pace') {
                  accentBg = 'bg-[#877499]';
                  tagBg = 'bg-[#F2E0CA] text-[#231A0D]';
                  tagLabel = 'Gentle Pace';
                }

                return (
                  <article
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="cursor-pointer w-full bg-[#FFFDF9] rounded-[20px] p-3.5 flex items-center gap-3 shadow-cozy-card border border-[#F2ECE2] active:scale-[0.99] transition-all"
                  >
                    {/* Left Accent indicator */}
                    <div className={`w-1.5 h-9 rounded-full ${accentBg} flex-shrink-0`} />

                    {/* Circular toggle button */}
                    <button
                      type="button"
                      aria-label={`Mark task ${task.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center active:scale-90 transition-transform ${
                        isCompleted ? 'bg-[#2E6767] text-white' : 'bg-[#F2E0CA] text-[#2E6767]'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[#2E6767]/30" />
                      )}
                    </button>

                    {/* Task Title & Details */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold text-[#231A0D] truncate transition-all ${
                          isCompleted ? 'line-through opacity-50' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[#71626A] text-[11px] font-semibold">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9" strokeWidth="2" />
                          <path d="M12 7v5l3 3" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span>
                          {task.scheduled_time || '10:00 AM'} • {task.duration_minutes}m
                        </span>
                      </div>
                    </div>

                    {/* Category Tag */}
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex-shrink-0 ${tagBg}`}>
                      {tagLabel}
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Acoustic Atmosphere & Soundscape Audio Tile */}
        <section className="w-full bg-[#FFF1E4] rounded-[22px] p-3.5 flex items-center gap-3 shadow-cozy-card border border-[#E9D7C2]">
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            aria-label={isPlayingAudio ? 'Pause peaceful stream audio' : 'Play peaceful stream audio'}
            className="w-11 h-11 rounded-full bg-[#665578] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform flex-shrink-0"
          >
            {isPlayingAudio ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-[#2E6767] uppercase tracking-wider">
                Acoustic Atmosphere
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#679F9F]" />
            </div>
            <p className="text-xs font-bold text-[#231A0D] truncate">
              {isPlayingAudio ? 'Playing: Cedar Forest & Stream 🌲' : 'Cedar Forest & Gentle Stream'}
            </p>
          </div>

          {/* Animated sound bars */}
          <div className="flex items-end gap-1 h-5 pr-1">
            <span
              className={`w-1 bg-[#665578] rounded-full transition-all duration-300 ${
                isPlayingAudio ? 'h-4 animate-pulse' : 'h-2'
              }`}
            />
            <span
              className={`w-1 bg-[#2E6767] rounded-full transition-all duration-300 ${
                isPlayingAudio ? 'h-5 animate-bounce' : 'h-3'
              }`}
            />
            <span
              className={`w-1 bg-[#954056] rounded-full transition-all duration-300 ${
                isPlayingAudio ? 'h-3 animate-pulse' : 'h-1.5'
              }`}
            />
          </div>
        </section>
      </main>
    </div>
  );
};
