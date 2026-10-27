import React, { useState } from 'react';
import { NotificationItem } from '../types/index.ts';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onOpenScheduleNow?: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onMarkRead,
  onOpenScheduleNow,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'reminders' | 'ai' | 'moments'>('all');

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  return (
    <div className="relative w-full min-h-screen bg-[#877499] text-[#2D2833] flex flex-col justify-between overflow-x-hidden selection:bg-[#E78299] selection:text-white">
      {/* Subtle Warm Ambient Shapes */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-56 h-56 rounded-full bg-[#E6D4BF]/10 pointer-events-none" />
      <div className="absolute bottom-28 -right-12 w-48 h-48 rounded-full bg-[#E78299]/10 pointer-events-none" />

      {/* iOS Status Bar */}
      <div className="relative z-20 pt-3 px-7 flex justify-between items-center text-white/90 text-xs font-semibold tracking-tight">
        <span>9:41</span>
        <div className="flex items-center space-x-1.5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.64 10.58 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
          </svg>
          <div className="w-5 h-2.5 border-2 border-white/90 rounded-sm p-0.5 flex items-center">
            <div className="h-full w-full bg-white/90 rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Header Section */}
      <header className="relative z-10 px-6 pt-2 pb-2 flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white">
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-white tracking-wide">Notifications</h1>

        <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <circle cx="5" cy="12" r="2" />
          </svg>
        </div>
      </header>

      {/* Filter Pills Row */}
      <div className="relative z-10 px-6 py-1 flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-cozy-card flex items-center gap-1.5 active:scale-95 transition-all ${
            activeFilter === 'all'
              ? 'bg-[#FFFDF9] text-[#2D2833]'
              : 'bg-white/15 text-white/90 hover:bg-white/20'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#E78299]" />
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('reminders')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all ${
            activeFilter === 'reminders'
              ? 'bg-[#FFFDF9] text-[#2D2833] font-bold'
              : 'bg-white/15 text-white/90 hover:bg-white/20'
          }`}
        >
          Reminders
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('ai')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all ${
            activeFilter === 'ai'
              ? 'bg-[#FFFDF9] text-[#2D2833] font-bold'
              : 'bg-white/15 text-white/90 hover:bg-white/20'
          }`}
        >
          Mindful AI
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('moments')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all ${
            activeFilter === 'moments'
              ? 'bg-[#FFFDF9] text-[#2D2833] font-bold'
              : 'bg-white/15 text-white/90 hover:bg-white/20'
          }`}
        >
          Moments
        </button>
      </div>

      {/* Notifications List */}
      <main className="relative z-10 flex-1 px-5 pt-2 pb-28 overflow-y-auto space-y-3">
        {/* Section Label: Today */}
        <div className="flex items-center justify-between px-1 pt-1 pb-0.5">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Today</span>
          <span className="text-[11px] font-semibold text-white/70">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </span>
        </div>

        {filteredNotifications.map((item) => {
          let badgeBg = 'bg-[#679F9F] text-white';
          if (item.badge_color === 'sandstone') badgeBg = 'bg-[#E6D4BF] text-[#705436]';
          if (item.badge_color === 'candy') badgeBg = 'bg-[#E78299] text-white';
          if (item.badge_color === 'azur') badgeBg = 'bg-[#7D97C9] text-white';

          return (
            <div
              key={item.id}
              onClick={() => onMarkRead(item.id)}
              className="cursor-pointer bg-[#FFFDF9] rounded-[24px] p-4 shadow-cozy-card flex items-start gap-3.5 border-2 border-[#FFFDF9] active:scale-[0.99] transition-transform"
            >
              {/* Badge Icon */}
              <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm ${badgeBg}`}>
                {item.icon_type === 'sparkle' && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2L14.2 8.3L20.5 10.5L14.2 12.7L12 19L9.8 12.7L3.5 10.5L9.8 8.3L12 2Z" />
                  </svg>
                )}
                {item.icon_type === 'moon' && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.3 2a10 10 0 0 0-.19 1.4 10 10 0 0 0 10 10c.48 0 .95-.07 1.4-.19A10.01 10.01 0 0 1 12 22a10 10 0 0 1-10-10A10 10 0 0 1 12.3 2z" />
                  </svg>
                )}
                {item.icon_type === 'bell' && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                )}
                {item.icon_type === 'heart' && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h2 className="text-sm font-bold text-[#2D2833] leading-snug">{item.title}</h2>
                  <span className="text-[10px] font-semibold text-[#7D7585] whitespace-nowrap">
                    {item.timestamp_text}
                  </span>
                </div>
                <p className="text-xs text-[#2D2833]/80 mt-1 leading-relaxed font-medium">
                  {item.message}
                </p>

                {item.action_label && (
                  <div className="mt-2.5 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenScheduleNow) onOpenScheduleNow();
                      }}
                      className="px-3 py-1 bg-[#679F9F]/15 text-[#2E6767] hover:bg-[#679F9F]/25 text-[11px] font-bold rounded-full transition-colors"
                    >
                      {item.action_label}
                    </button>
                    {item.secondary_action_label && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkRead(item.id);
                        }}
                        className="px-3 py-1 bg-[#F7F2EC] text-[#7D7585] text-[11px] font-bold rounded-full"
                      >
                        {item.secondary_action_label}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Unread dot */}
              {!item.read && <span className="w-2 h-2 rounded-full bg-[#E78299] mt-1.5 flex-shrink-0" />}
            </div>
          );
        })}
      </main>
    </div>
  );
};
