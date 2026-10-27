import React from 'react';

export type NavTab = 'home' | 'chat' | 'alerts' | 'me' | 'insights';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddTask: () => void;
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddTask,
  unreadCount = 3,
}) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-5 flex justify-center pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto w-full max-w-[360px] bg-[#FFFDF9] rounded-full px-4 py-2 shadow-nav flex items-center justify-between border border-[#FFF1E4] relative"
      >
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          aria-label="Home daily flow"
          className={`flex flex-col items-center justify-center w-12 py-0.5 transition-colors ${
            currentTab === 'home' ? 'text-[#679F9F]' : 'text-[#7D7585] hover:text-[#2D2833]'
          }`}
        >
          {currentTab === 'home' ? (
            <div className="w-10 h-10 rounded-full bg-[#679F9F] text-white flex items-center justify-center shadow-md -mt-4 transition-transform scale-105">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
          ) : (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          )}
          <span className={`text-[10px] font-bold mt-0.5 ${currentTab === 'home' ? 'text-[#679F9F]' : ''}`}>
            Home
          </span>
        </button>

        {/* Chat / Sync Buddy Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('chat')}
          aria-label="Sync Buddy companion chat"
          className={`flex flex-col items-center justify-center w-12 py-0.5 transition-colors ${
            currentTab === 'chat' ? 'text-[#7A2E3B]' : 'text-[#7D7585] hover:text-[#2D2833]'
          }`}
        >
          {currentTab === 'chat' ? (
            <div className="w-10 h-10 rounded-full bg-[#7A2E3B] text-white flex items-center justify-center shadow-md -mt-4 transition-transform scale-105">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
          ) : (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          )}
          <span className={`text-[10px] font-bold mt-0.5 ${currentTab === 'chat' ? 'text-[#7A2E3B]' : ''}`}>
            Chat
          </span>
        </button>

        {/* Center Raised Add (+) Button */}
        <div className="flex flex-col items-center justify-center w-12 relative -mt-5">
          <button
            type="button"
            onClick={onOpenAddTask}
            aria-label="Add new task or mood check-in"
            className="w-12 h-12 rounded-full bg-[#E78299] text-white flex items-center justify-center shadow-raised hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 4a1.5 1.5 0 011.5 1.5V10.5H19.5a1.5 1.5 0 110 3H13.5V19.5a1.5 1.5 0 11-3 0V13.5H4.5a1.5 1.5 0 110-3H10.5V5.5A1.5 1.5 0 0112 4z"
              />
            </svg>
          </button>
          <span className="text-[10px] font-extrabold text-[#E78299] mt-0.5">Add</span>
        </div>

        {/* Alerts / Notifications Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('alerts')}
          aria-label="Notifications and alerts"
          className={`flex flex-col items-center justify-center w-12 py-0.5 relative transition-colors ${
            currentTab === 'alerts' ? 'text-[#877499]' : 'text-[#7D7585] hover:text-[#2D2833]'
          }`}
        >
          {currentTab === 'alerts' ? (
            <div className="w-10 h-10 rounded-full bg-[#877499] text-white flex items-center justify-center shadow-md -mt-4 transition-transform scale-105">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </div>
          ) : (
            <div className="relative">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E78299] ring-2 ring-white" />
              )}
            </div>
          )}
          <span className={`text-[10px] font-bold mt-0.5 ${currentTab === 'alerts' ? 'text-[#877499]' : ''}`}>
            Alerts
          </span>
        </button>

        {/* Me / Profile Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('me')}
          aria-label="Profile and mindful settings"
          className={`flex flex-col items-center justify-center w-12 py-0.5 transition-colors ${
            currentTab === 'me' ? 'text-[#5B77AA]' : 'text-[#7D7585] hover:text-[#2D2833]'
          }`}
        >
          {currentTab === 'me' ? (
            <div className="w-10 h-10 rounded-full bg-[#7D97C9] text-white flex items-center justify-center shadow-md -mt-4 transition-transform scale-105">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          ) : (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
          <span className={`text-[10px] font-bold mt-0.5 ${currentTab === 'me' ? 'text-[#5B77AA]' : ''}`}>
            Me
          </span>
        </button>
      </nav>
    </div>
  );
};
