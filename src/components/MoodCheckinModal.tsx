import React, { useState } from 'react';
import { MoodType } from '../types/index.ts';

interface MoodCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { mood: MoodType; energy_level: number; focus_level: number; note?: string }) => Promise<void>;
  currentMood?: MoodType;
  currentEnergy?: number;
}

interface MoodOption {
  type: MoodType;
  label: string;
  defaultEnergy: number;
  narrative: string;
  color: string;
  iconSvg: React.ReactNode;
}

const moodOptions: MoodOption[] = [
  {
    type: 'energetic',
    label: 'Energetic',
    defaultEnergy: 5,
    narrative: 'Bubbly & ready for bright momentum!',
    color: '#FED888',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="#FED888" />
        <polygon points="12,12 13.5,15 16.5,15.5 14,17.5 15,20.5 12,18.8 9,20.5 10,17.5 7.5,15.5 10.5,15" fill="#6B4119" />
        <polygon points="24,12 25.5,15 28.5,15.5 26,17.5 27,20.5 24,18.8 21,20.5 22,17.5 19.5,15.5 22.5,15" fill="#6B4119" />
        <path d="M12 22 Q18 30 24 22" stroke="#6B4119" strokeWidth="2.5" strokeLinecap="round" fill="#EA6988" />
        <circle cx="9" cy="21" r="2.5" fill="#F8A7B8" />
        <circle cx="27" cy="21" r="2.5" fill="#F8A7B8" />
      </svg>
    ),
  },
  {
    type: 'happy',
    label: 'Happy',
    defaultEnergy: 4,
    narrative: 'Sunshine warmth and cheerful momentum.',
    color: '#FFE294',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="#FFE294" />
        <path d="M9.5 15 Q12.5 10.5 15.5 15" stroke="#683F1C" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M20.5 15 Q23.5 10.5 26.5 15" stroke="#683F1C" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="8" cy="20" r="3" fill="#F593A7" />
        <circle cx="28" cy="20" r="3" fill="#F593A7" />
        <path d="M12 21 C13.5 27 22.5 27 24 21" stroke="#683F1C" strokeWidth="2.6" strokeLinecap="round" fill="#E86E87" />
      </svg>
    ),
  },
  {
    type: 'calm',
    label: 'Calm',
    defaultEnergy: 3,
    narrative: 'Peaceful, unhurried, like a warm cup of tea.',
    color: '#BFE3D5',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="#BFE3D5" />
        <path d="M10 16 Q13 18 16 16" stroke="#3A6356" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M20 16 Q23 18 26 16" stroke="#3A6356" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M14 23 Q18 26 22 23" stroke="#3A6356" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="9.5" cy="20" r="2.2" fill="#EFA2A2" opacity="0.8" />
        <circle cx="26.5" cy="20" r="2.2" fill="#EFA2A2" opacity="0.8" />
      </svg>
    ),
  },
  {
    type: 'tired',
    label: 'Tired',
    defaultEnergy: 2,
    narrative: 'Cozy blanket needed. We will soften your flow.',
    color: '#D8CBE4',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="#D8CBE4" />
        <path d="M10 17 L16 17" stroke="#5D4B70" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 17 L26 17" stroke="#5D4B70" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="18" cy="24" rx="3.5" ry="4" fill="#6A537C" />
        <path d="M27 7 L31 7 L27 12 L31 12" stroke="#877499" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    type: 'low',
    label: 'Low',
    defaultEnergy: 1,
    narrative: 'Extra gentle day. No pressure, just soft steps.',
    color: '#C5D7F2',
    iconSvg: (
      <svg className="w-8 h-8" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="#C5D7F2" />
        <circle cx="13" cy="16" r="2.2" fill="#3D567F" />
        <circle cx="23" cy="16" r="2.2" fill="#3D567F" />
        <path d="M14 24 Q18 21 22 24" stroke="#3D567F" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M25 21 C25 21 27 22.5 27 23.5 C27 24.5 26 25 25 25 C24 25 23 24.5 23 23.5 C23 22.5 25 21 25 21 Z" fill="#7FA9E0" />
      </svg>
    ),
  },
];

const paces: Record<number, string> = {
  1: 'Soft pace • 1 gentle goal & generous rest',
  2: 'Cozy pace • 2 unhurried tasks + tea pause',
  3: 'Steady rhythm • 2 focus intervals & mindful walk',
  4: 'Optimal for 3 focus goals + 2 breaks',
  5: 'Full flow • Deep creative sessions & bold milestones',
};

export const MoodCheckinModal: React.FC<MoodCheckinModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentMood = 'happy',
  currentEnergy = 4,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>(currentMood);
  const [energyLevel, setEnergyLevel] = useState<number>(currentEnergy);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentOption = moodOptions.find((m) => m.type === selectedMood) || moodOptions[1];

  const handleSelectMood = (opt: MoodOption) => {
    setSelectedMood(opt.type);
    setEnergyLevel(opt.defaultEnergy);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onSubmit({
        mood: selectedMood,
        energy_level: energyLevel,
        focus_level: energyLevel,
        note: currentOption.narrative,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Daily mood and energy check-in"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-[390px] h-full sm:h-[844px] bg-gradient-to-b from-[#E98AA0] via-[#E78299] to-[#E3758E] flex flex-col justify-between overflow-hidden shadow-2xl sm:rounded-[46px] text-white">
        {/* Soft ambient background circles */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#f197ac] opacity-50 pointer-events-none" />
        <div className="absolute top-1/4 -right-16 w-52 h-52 rounded-full bg-[#ee8ea3] opacity-45 pointer-events-none" />
        <div className="absolute -bottom-16 -left-10 w-60 h-60 rounded-full bg-[#dd6d85] opacity-35 pointer-events-none" />

        {/* Top iOS Status Bar */}
        <div className="relative z-10 pt-3 px-7 flex items-center justify-between text-white font-bold text-xs tracking-tight">
          <span>9:41</span>
          <div className="w-20 h-3.5 bg-black/15 rounded-full" />
          <div className="flex items-center space-x-1.5">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.58 10.58 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
            </svg>
            <div className="w-5 h-2.5 border-2 border-white rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-xs" />
            </div>
          </div>
        </div>

        {/* Header navigation bar */}
        <div className="relative z-10 px-6 pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close check-in modal"
            className="w-10 h-10 rounded-full bg-[#FFF8F2] text-[#64474E] flex items-center justify-center shadow-cozy-card active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F2] text-[#64474E] text-[11px] font-bold shadow-cozy-card tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#679F9F] inline-block" />
            MORNING CHECK-IN
          </div>

          <div className="w-10 h-10 rounded-full bg-[#FFF8F2] text-[#64474E] flex items-center justify-center shadow-cozy-card">
            <span className="text-base">☕</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="relative z-10 px-5 flex-1 flex flex-col justify-evenly py-2">
          {/* Top Text Prompt */}
          <div className="text-center">
            <h2 className="text-white font-extrabold text-[28px] leading-tight tracking-tight drop-shadow-sm">
              How are you feeling today?
            </h2>
            <p className="text-[#E6D4BF] font-semibold text-xs mt-1 tracking-wide">
              Tune your day gently to your rhythm
            </p>
          </div>

          {/* Mood selection row */}
          <div>
            <div className="flex items-start justify-between gap-1 px-1">
              {moodOptions.map((opt) => {
                const isSelected = selectedMood === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => handleSelectMood(opt)}
                    className="flex flex-col items-center gap-1.5 flex-1 active:scale-95 transition-all"
                  >
                    <div
                      className={`relative w-[58px] h-[58px] rounded-full bg-[#FFF8F2] flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? 'ring-4 ring-[#E6D4BF] scale-110 shadow-cozy-selected'
                          : 'shadow-cozy-card opacity-90'
                      }`}
                    >
                      {opt.iconSvg}
                    </div>
                    <span
                      className={`text-white text-xs tracking-tight ${
                        isSelected ? 'font-extrabold underline decoration-[#E6D4BF] decoration-2' : 'font-semibold'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic narrative banner */}
            <div className="mt-4 px-4 py-2.5 rounded-2xl bg-[#FFF8F2] text-[#64474E] text-center shadow-cozy-card flex items-center justify-center gap-1.5 border border-[#E6D4BF]">
              <span className="text-sm">✨</span>
              <span className="text-xs font-bold leading-tight">
                Selected: <strong className="text-[#877499]">{currentOption.label}</strong> — {currentOption.narrative}
              </span>
            </div>
          </div>

          {/* Energy Level Slider Container */}
          <div className="w-full bg-[#FFF8F2] rounded-3xl p-4 shadow-cozy-card border-2 border-[#E6D4BF] text-[#64474E]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FDE9ED] text-[#E78299] flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <span className="block font-extrabold text-xs text-[#64474E] leading-tight">
                    Energy Level
                  </span>
                  <span className="block text-[#96747E] text-[10px] font-semibold">
                    How much fuel is in your tank?
                  </span>
                </div>
              </div>

              {/* Numerical Badge */}
              <div className="px-3 py-1 rounded-full bg-[#E6D4BF] text-[#64474E] font-bold text-xs shadow-inner flex items-center gap-0.5">
                <span className="text-sm">{energyLevel}</span>
                <span className="text-[10px] opacity-75">/ 5</span>
              </div>
            </div>

            {/* Slider track */}
            <div className="py-2 px-1">
              <div className="w-full flex justify-between px-1 mb-1 text-[10px] font-bold text-[#96747E]">
                <span>1 Gentle</span>
                <span>2</span>
                <span>3 Steady</span>
                <span>4</span>
                <span>5 Vibrant</span>
              </div>

              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                aria-label="Energy level scale from 1 gentle to 5 vibrant"
                className="w-full cursor-pointer"
              />
            </div>

            {/* Adaptive schedule pace tag */}
            <div className="mt-2 pt-2 border-t border-[#E6D4BF]/40 flex items-center justify-between text-[11px] font-semibold text-[#96747E]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#877499] inline-block" />
                Today's pace:
              </span>
              <span className="text-[#64474E] font-bold">{paces[energyLevel]}</span>
            </div>
          </div>

          {/* Bottom Action: "Set my day" */}
          <div className="pt-1">
            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirm}
              className="w-full py-3.5 px-6 rounded-full bg-[#877499] hover:bg-[#725F84] active:scale-[0.98] text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-raised transition-all disabled:opacity-50"
            >
              <span>{submitting ? 'Pacing your day gently...' : 'Set my day'}</span>
              <svg className="w-4 h-4 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <p className="text-center text-white/90 text-[10.5px] font-semibold mt-2">
              🌿 You can retune this anytime if your day changes
            </p>
          </div>
        </div>

        {/* iOS home indicator */}
        <div className="pb-3 flex justify-center">
          <div className="w-32 h-1 rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  );
};
