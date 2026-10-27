import React, { useState } from 'react';
import { InsightsData } from '../types/index.ts';

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: InsightsData | null;
}

export const InsightsModal: React.FC<InsightsModalProps> = ({
  isOpen,
  onClose,
  insights,
}) => {
  const [range, setRange] = useState<'7' | '30'>('7');

  if (!isOpen) return null;

  const moodTrends = insights?.mood_trends || [];
  const harmonyScore = insights?.weekly_harmony_score ?? 92;
  const completionRate = insights?.completion_rate ?? 92;
  const bestHours = insights?.best_focus_hours || [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mindful mood and harmony insights"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-[390px] h-full sm:h-[844px] bg-[#679F9F] flex flex-col justify-between overflow-hidden shadow-2xl sm:rounded-[44px] text-[#2D2833]">
        {/* iOS status bar */}
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

        {/* Top Header */}
        <header className="px-6 pt-2 pb-2 flex items-center justify-between z-20">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to daily flow"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <svg className="w-5 h-5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Mindful Insights</h1>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
            <span className="text-base">📊</span>
          </div>
        </header>

        {/* Range Pill Toggle */}
        <div className="px-6 py-1 flex items-center justify-center gap-2 z-10">
          <div className="bg-white/20 p-1 rounded-full flex gap-1">
            <button
              type="button"
              onClick={() => setRange('7')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                range === '7' ? 'bg-[#FFFDF9] text-[#2E6767] shadow-sm' : 'text-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setRange('30')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                range === '30' ? 'bg-[#FFFDF9] text-[#2E6767] shadow-sm' : 'text-white'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 px-5 pt-3 pb-8 z-10 overflow-y-auto space-y-3">
          {/* Top Score Banner: Weekly Harmony */}
          <div className="bg-[#FFFDF9] rounded-[24px] p-4 shadow-cozy flex items-center justify-between border border-[#E9D7C2]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D7585]">
                Weekly Harmony Score
              </span>
              <h2 className="text-2xl font-extrabold text-[#231A0D] mt-0.5">
                {harmonyScore}% <span className="text-sm font-bold text-[#679F9F]">Restorative</span>
              </h2>
              <p className="text-[11px] text-[#71626A] font-semibold mt-0.5">
                Sync Buddy: “You honoured your gentle rhythms beautifully!”
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E6D4BF] flex items-center justify-center text-2xl shadow-inner">
              🌱
            </div>
          </div>

          {/* Energy & Mood Rhythm Chart */}
          <div className="bg-[#FFFDF9] rounded-[24px] p-4 shadow-cozy space-y-3 border border-[#E9D7C2]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#231A0D] uppercase tracking-wide">
                Daily Energy Trends
              </span>
              <span className="text-[10px] font-bold text-[#679F9F]">Avg: 3.8 / 5</span>
            </div>

            {/* Visual Bar Graph */}
            <div className="flex items-end justify-between h-28 pt-2 px-1 border-b border-[#F2ECE2]">
              {moodTrends.map((t, idx) => {
                const heightPercent = (t.energy_level / 5) * 100;
                let barColor = 'bg-[#679F9F]';
                if (t.energy_level >= 4) barColor = 'bg-[#E78299]';
                if (t.energy_level <= 2) barColor = 'bg-[#877499]';

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-bold text-[#71626A]">{t.energy_level}</span>
                    <div className="w-5 bg-[#F2ECE2] rounded-full h-20 flex items-end p-0.5">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full ${barColor} rounded-full transition-all duration-500`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#231A0D]">{t.day_name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Focus Windows */}
          <div className="bg-[#FFFDF9] rounded-[24px] p-4 shadow-cozy space-y-2.5 border border-[#E9D7C2]">
            <span className="text-xs font-bold text-[#231A0D] uppercase tracking-wide block">
              Optimal Focus Intervals
            </span>

            {bestHours.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F8F3ED]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E78299]" />
                  <div>
                    <p className="text-xs font-bold text-[#231A0D]">{h.label}</p>
                    <p className="text-[10px] font-semibold text-[#71626A]">{h.hour}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#665578]">{h.score}% match</span>
              </div>
            ))}
          </div>

          {/* Completion Rate Pill */}
          <div className="bg-[#FFFDF9] rounded-[22px] p-3.5 shadow-cozy flex items-center justify-between border border-[#E9D7C2]">
            <div>
              <p className="text-xs font-bold text-[#231A0D]">Guilt-Free Completion Rate</p>
              <p className="text-[10px] font-semibold text-[#71626A]">11 of 12 mindful goals embraced</p>
            </div>
            <span className="px-3 py-1 bg-[#679F9F]/15 text-[#2E6767] font-extrabold text-xs rounded-full">
              {completionRate}%
            </span>
          </div>
        </main>
      </div>
    </div>
  );
};
