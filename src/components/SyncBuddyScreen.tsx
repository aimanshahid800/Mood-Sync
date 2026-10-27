import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, MoodCheckin } from '../types/index.ts';

interface SyncBuddyScreenProps {
  messages: ChatMessage[];
  latestCheckin: MoodCheckin | null;
  onSendMessage: (text: string) => Promise<void>;
  onScheduleConfirmed?: () => void;
}

export const SyncBuddyScreen: React.FC<SyncBuddyScreenProps> = ({
  messages,
  latestCheckin,
  onSendMessage,
  onScheduleConfirmed,
}) => {
  const [inputText, setInputText] = useState('');
  const [confirmedState, setConfirmedState] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const txt = inputText.trim();
    setInputText('');
    setIsSending(true);
    try {
      await onSendMessage(txt);
    } finally {
      setIsSending(false);
    }
  };

  const handleConfirmChip = () => {
    setConfirmedState(true);
    if (onScheduleConfirmed) onScheduleConfirmed();
  };

  const handleModifyChip = () => {
    setInputText('Could we make that rest break 30 minutes instead?');
  };

  const energyLevel = latestCheckin?.energy_level ?? 2;
  const energyLabel = energyLevel <= 2 ? 'Gentle (2/5)' : energyLevel === 3 ? 'Steady (3/5)' : 'Vibrant (4/5)';

  return (
    <div className="relative w-full min-h-screen bg-[#E6D4BF] text-[#231A0D] flex flex-col justify-between overflow-x-hidden selection:bg-[#E78299] selection:text-white">
      {/* Top iOS Status Bar */}
      <div className="relative z-10 pt-3 px-7 flex justify-between items-center text-[#231A0D] text-xs font-semibold tracking-wide">
        <span>9:41</span>
        <div className="flex items-center space-x-1.5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.58 10.58 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
          </svg>
          <div className="w-5 h-2.5 border-2 border-[#231A0D] rounded-sm p-0.5 flex items-center">
            <div className="h-full w-full bg-[#231A0D] rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Header Bar */}
      <header className="w-full flex items-center justify-between py-2 px-6">
        <div className="w-10 h-10 rounded-full bg-white text-[#231A0D] flex items-center justify-center shadow-sm border border-[#E9D7C2]">
          <svg className="w-4 h-4 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-extrabold text-base text-[#231A0D] tracking-wide">Sync Buddy</h1>
          <span className="text-[10px] text-[#679F9F] font-bold">Mindful Rhythm Companion</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-white text-[#231A0D] flex items-center justify-center shadow-sm border border-[#E9D7C2]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <circle cx="5" cy="12" r="2" />
          </svg>
        </div>
      </header>

      {/* Chat Messages Feed */}
      <main className="flex-1 px-4 py-2 pb-40 overflow-y-auto space-y-3">
        {/* Timestamp & Energy Badge */}
        <div className="flex justify-center my-1">
          <div className="px-4 py-1.5 rounded-full bg-[#F5EAD9] text-[#4A454D] shadow-sm flex items-center gap-1.5 border border-[#E9D7C2]">
            <span className="text-xs">🌿</span>
            <span className="font-bold text-[11px]">Today, 2:15 PM • Energy: {energyLabel}</span>
          </div>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          if (isUser) {
            return (
              <div key={msg.id} className="flex flex-col items-end max-w-[85%] self-end ml-auto">
                <div className="bg-[#7A2E3B] text-white rounded-[24px] rounded-br-xs px-5 py-3 shadow-[0_4px_16px_rgba(122,46,59,0.25)]">
                  <p className="font-bold text-[14px] leading-snug">{msg.text}</p>
                </div>
                <span className="font-bold text-[10px] text-[#7B757D] mt-1 mr-2">
                  {msg.timestamp_text}
                </span>
              </div>
            );
          }

          // Buddy Message
          return (
            <div key={msg.id} className="flex items-start gap-2.5 max-w-[96%] self-start mr-auto">
              {/* Mascot avatar icon */}
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#F2E0CA] shadow-sm mt-1 bg-[#F5EAD9]">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WCbR-zHjyJquuPmK8njIjnuqi649k8lDaF82aNXNIxqndlZGbCnL4xPh8fh2upqCeSjI0DNamaXb2WUmSV-O7w8ntJJX-v7aMaPebfzwt-Sdeh3dsy-7MYZVteFJmiOpgcv9O_SsRRL5UFp4byvSqQpglZLYquzO8whGUdFEPfkXqiT7sSureOEq-5yAcHhVMfSMZ_qVBOwfLwN5AESrWJj-OdlskpUKe8Go-u5r5XhUptCol4mbMOPL0"
                  alt="Sync Buddy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                <div className="bg-[#FFFDF9] rounded-[26px] rounded-tl-xs p-4 shadow-[0_6px_20px_rgba(45,38,51,0.06)] border border-[#F2E0CA] text-[#231A0D]">
                  <p className="font-bold text-[14px] leading-relaxed whitespace-pre-line mb-1.5">
                    {msg.text}
                  </p>

                  {/* Suggestions block if present */}
                  {msg.suggestions && (
                    <>
                      <div className="flex flex-col gap-2 bg-[#F5EAD9] border border-[#E3D1BE] rounded-2xl p-3 my-2">
                        {msg.suggestions.moved && (
                          <div className="flex items-start gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#7A2E3B] shrink-0 mt-1" />
                            <p className="text-xs leading-snug text-[#231A0D]">
                              <span className="font-bold text-[#7A2E3B]">Moved:</span>{' '}
                              {msg.suggestions.moved.replace(/^Moved:\s*/i, '')}
                            </p>
                          </div>
                        )}
                        {msg.suggestions.kept && (
                          <div className="flex items-start gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#679F9F] shrink-0 mt-1" />
                            <p className="text-xs leading-snug text-[#231A0D]">
                              <span className="font-bold text-[#2E6767]">Kept:</span>{' '}
                              {msg.suggestions.kept.replace(/^Kept:\s*/i, '')}
                            </p>
                          </div>
                        )}
                        {msg.suggestions.swapped && (
                          <div className="flex items-start gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#877499] shrink-0 mt-1" />
                            <p className="text-xs leading-snug text-[#231A0D]">
                              <span className="font-bold text-[#665578]">Swapped:</span>{' '}
                              {msg.suggestions.swapped.replace(/^Swapped:\s*/i, '')}
                            </p>
                          </div>
                        )}
                      </div>

                      <p className="font-bold text-xs text-[#231A0D] flex items-center gap-1.5 mt-1">
                        <span>Take a gentle breath. You're completely guilt-free today.</span>
                        <span className="text-sm">🌸</span>
                      </p>
                    </>
                  )}
                </div>

                {/* Interactive proposal chips */}
                {msg.suggestions && (
                  <div className="flex flex-wrap items-center gap-2 pl-1">
                    <button
                      type="button"
                      onClick={handleConfirmChip}
                      className={`px-4 py-2.5 rounded-full font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5 ${
                        confirmedState
                          ? 'bg-[#2E6767] text-white'
                          : 'bg-[#7A2E3B] text-white shadow-[0_4px_12px_rgba(122,46,59,0.25)]'
                      }`}
                    >
                      <span>{confirmedState ? 'Schedule Adjusted Gently 🌿' : 'Looks good, thank you ✨'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleModifyChip}
                      className="px-4 py-2.5 rounded-full bg-[#FFFDF9] text-[#231A0D] font-bold text-xs shadow-sm border border-[#E0CFBD] active:scale-95 transition-transform"
                    >
                      <span>Change to 30m break</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </main>

      {/* Bottom Message Input Bar */}
      <footer className="fixed bottom-20 left-0 right-0 px-4 max-w-[390px] mx-auto z-30">
        <div className="w-full bg-[#FFFDF9] rounded-full p-1.5 shadow-cozy-lg border border-[#F2E0CA] flex items-center gap-2">
          <button
            type="button"
            aria-label="Record voice note"
            onClick={() => setInputText('Feeling like taking a short mindful breathing break')}
            className="w-10 h-10 rounded-full bg-[#F5EAD9] flex items-center justify-center text-[#231A0D] active:scale-95 transition-transform shrink-0"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tell Sync Buddy how you feel..."
            aria-label="Message to Sync Buddy"
            className="w-full bg-transparent font-semibold text-xs text-[#231A0D] placeholder:text-[#7B757D] focus:outline-none px-2"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            aria-label="Send message"
            className="w-10 h-10 rounded-full bg-[#7A2E3B] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0 disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};
