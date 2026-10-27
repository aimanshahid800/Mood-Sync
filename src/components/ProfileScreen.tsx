import React from 'react';
import { Profile } from '../types/index.ts';

interface ProfileScreenProps {
  profile: Profile | null;
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>;
  onLogout: () => void;
  onOpenAuth?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onLogout,
}) => {
  const isRamadan = profile?.ramadan_mode ?? true;
  const notificationsOn = profile?.notifications_enabled ?? true;

  const toggleRamadan = () => {
    onUpdateProfile({ ramadan_mode: !isRamadan });
  };

  const toggleNotifications = () => {
    onUpdateProfile({ notifications_enabled: !notificationsOn });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#7D97C9] text-[#2D2833] flex flex-col justify-between overflow-x-hidden selection:bg-[#E78299] selection:text-white">
      {/* Background ambient shapes */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#9CB1DA] opacity-40 pointer-events-none" />
      <div className="absolute top-44 -left-20 w-52 h-52 rounded-full bg-[#5B77AA] opacity-30 pointer-events-none" />
      <div className="absolute bottom-48 -right-12 w-48 h-48 rounded-full bg-[#9CB1DA] opacity-35 pointer-events-none" />
      <div className="absolute bottom-20 -left-10 w-40 h-40 rounded-full bg-[#5B77AA] opacity-25 pointer-events-none" />

      {/* iOS Status Bar */}
      <div className="relative z-10 pt-3 px-7 flex justify-between items-center text-white text-xs font-semibold tracking-wide">
        <span>9:41</span>
        <div className="flex items-center space-x-1.5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.58 10.58 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
          </svg>
          <div className="w-5 h-2.5 border-2 border-white rounded-sm p-0.5 flex items-center">
            <div className="h-full w-full bg-white rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 px-6 pt-2 pb-1 flex justify-between items-center">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white transition">
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <h1 className="text-white text-xl font-bold tracking-normal">Profile &amp; Settings</h1>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white transition">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
          </svg>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-5 pt-2 pb-28 space-y-4">
        {/* Profile Card / Avatar Section */}
        <section className="flex flex-col items-center justify-center pt-1 pb-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#FFFDF9] p-1.5 shadow-cozy flex items-center justify-center">
              <img
                src={profile?.avatar_url || '/assets/aistudio/Image_1_c15772d0.jpeg'}
                alt={profile?.display_name || 'User Profile'}
                className="w-full h-full object-cover rounded-full bg-[#E6D4BF]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <button
              type="button"
              aria-label="Edit Profile"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#E78299] text-white flex items-center justify-center shadow-md border-2 border-[#FFFDF9] active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <h2 className="text-white font-bold text-xl mt-2 tracking-wide flex items-center gap-1.5">
            {profile?.display_name || 'Amina Malik'}
            <span className="w-2 h-2 rounded-full bg-[#679F9F]" />
          </h2>
          <p className="text-white/80 text-xs font-semibold mt-0.5">
            {profile?.tagline || 'Mindful Rhythm • Serene Mode'}
          </p>
        </section>

        {/* Settings Cards Container */}
        <div className="space-y-3">
          {/* 1. Ramadan Mode (Solid Sandstone Background) */}
          <div className="bg-[#E6D4BF] rounded-[26px] p-4 shadow-cozy flex items-center justify-between border-2 border-[#D9C4AC]">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#877499] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 10.9-10.9A10 10 0 0 1 12.3 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#2D2833] text-base">Ramadan Mode</span>
                  <span
                    className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isRamadan ? 'bg-[#E78299]' : 'bg-gray-400'
                    }`}
                  >
                    {isRamadan ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
                <p className="text-[#71626A] text-xs font-medium mt-0.5">
                  Suhoor, Iftar &amp; adjusted gentle focus
                </p>
              </div>
            </div>

            {/* Chunky Rounded Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isRamadan}
              aria-label="Toggle Ramadan Mode"
              onClick={toggleRamadan}
              className={`w-14 h-8 rounded-full p-1 flex items-center cursor-pointer shadow-inner transition-colors ${
                isRamadan ? 'bg-[#E78299] justify-end' : 'bg-[#C4B29E] justify-start'
              }`}
            >
              <div className="w-6 h-6 bg-[#FFFDF9] rounded-full shadow-md" />
            </button>
          </div>

          {/* 2. Solid Cream Settings Group (Card List) */}
          <div className="bg-[#FFFDF9] rounded-[28px] p-2 shadow-cozy divide-y divide-[#F7F3EB]">
            {/* Prayer Time Location */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#679F9F] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[#2D2833] text-sm">Prayer Time Location</p>
                  <p className="text-[#71626A] text-xs font-semibold">
                    {profile?.prayer_location || 'London, UK'} • {profile?.prayer_calculation || 'Hanafi calculation'}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#F7F3EB] flex items-center justify-center text-[#71626A]">
                <svg className="w-4 h-4 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E78299] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[#2D2833] text-sm">Notification Preferences</p>
                  <p className="text-[#71626A] text-xs font-semibold">Gentle nudges &amp; breath alarms</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={notificationsOn}
                aria-label="Toggle notifications"
                onClick={toggleNotifications}
                className={`w-14 h-8 rounded-full p-1 flex items-center cursor-pointer shadow-inner transition-colors ${
                  notificationsOn ? 'bg-[#877499] justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 bg-[#FFFDF9] rounded-full shadow-md" />
              </button>
            </div>

            {/* Theme Setting */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#5B77AA] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4 5 5 0 015-5h1a4 4 0 014 4v1a4 4 0 01-4 4H7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[#2D2833] text-sm">Theme &amp; Visual Comfort</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-3 h-3 rounded-full bg-[#7D97C9]" />
                    <span className="w-3 h-3 rounded-full bg-[#877499]" />
                    <span className="w-3 h-3 rounded-full bg-[#E6D4BF]" />
                    <span className="w-3 h-3 rounded-full bg-[#E78299]" />
                    <span className="text-[#71626A] text-xs font-semibold ml-1">Tactile Cozy</span>
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#F7F3EB] flex items-center justify-center text-[#71626A]">
                <svg className="w-4 h-4 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 3. Logout Card */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full bg-[#FFFDF9] rounded-[24px] p-3.5 shadow-cozy flex items-center justify-between active:bg-[#FFF5F7] transition"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE4EB] text-[#E78299] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="font-bold text-[#E78299] text-base tracking-wide">Logout</span>
            </div>

            <div className="text-[#E78299]">
              <svg className="w-5 h-5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Version note */}
          <p className="text-center text-white/70 text-xs font-semibold pt-1">
            MoodSync v2.4 • Handcrafted for Mindful Living
          </p>
        </div>
      </main>
    </div>
  );
};
