import { useState, useEffect, useCallback } from 'react';
import { api, clearAuthToken, setAuthToken } from './api/client.ts';
import { Task, MoodCheckin, Profile, NotificationItem, ChatMessage, InsightsData, MoodType, TaskPriority, TaskRequiredFocus } from './types/index.ts';
import { Navigation, NavTab } from './components/Navigation.tsx';
import { DailyFlowScreen } from './components/DailyFlowScreen.tsx';
import { MoodCheckinModal } from './components/MoodCheckinModal.tsx';
import { NewTaskModal } from './components/NewTaskModal.tsx';
import { SyncBuddyScreen } from './components/SyncBuddyScreen.tsx';
import { NotificationsScreen } from './components/NotificationsScreen.tsx';
import { ProfileScreen } from './components/ProfileScreen.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';
import { InsightsModal } from './components/InsightsModal.tsx';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Server state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [latestCheckin, setLatestCheckin] = useState<MoodCheckin | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Fetch all initial data from backend API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profData, tasksData, checkinData, notifsData, msgsData, insightsData] = await Promise.all([
        api.profile.get().catch(() => null),
        api.tasks.list().catch(() => []),
        api.moodCheckins.latest().catch(() => null),
        api.notifications.list().catch(() => []),
        api.buddy.getMessages().catch(() => []),
        api.insights.get(7).catch(() => null),
      ]);

      if (profData) setProfile(profData);
      setTasks(tasksData);
      setLatestCheckin(checkinData);
      setNotifications(notifsData);
      setChatMessages(msgsData);
      setInsights(insightsData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auth actions
  const handleLogin = async (email: string, pass: string) => {
    const res = await api.auth.login(email, pass);
    setAuthToken(res.token);
    setProfile(res.profile);
    setIsAuthenticated(true);
    loadData();
    showToast('Welcome back to your mindful flow 🌸');
  };

  const handleSignup = async (email: string, pass: string) => {
    const res = await api.auth.signup(email, pass);
    setAuthToken(res.token);
    setProfile(res.profile);
    setIsAuthenticated(true);
    loadData();
    showToast('Account created gently 🌸');
  };

  const handleGoogleLogin = async () => {
    const res = await api.auth.google('maya@mindfulday.com');
    setAuthToken(res.token);
    setProfile(res.profile);
    setIsAuthenticated(true);
    loadData();
    showToast('Signed in with Google 🌸');
  };

  const handleLogout = async () => {
    await api.auth.logout().catch(() => {});
    clearAuthToken();
    setIsAuthenticated(false);
    showToast('Rest peacefully. See you soon 🌙');
  };

  // Task actions with optimistic updates
  const handleToggleTask = async (taskId: string) => {
    // Optimistic toggle
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === 'completed' ? 'pending' : 'completed',
              completed_at: t.status === 'completed' ? undefined : new Date().toISOString(),
            }
          : t
      )
    );

    try {
      const updated = await api.tasks.toggleComplete(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error('Task toggle error:', err);
      // Rollback
      loadData();
    }
  };

  const handleAddTask = async (taskData: {
    title: string;
    description?: string;
    duration_minutes: number;
    priority: TaskPriority;
    required_focus: TaskRequiredFocus;
    category: 'deep_focus' | 'nourish' | 'spiritual' | 'gentle_pace' | 'general';
    scheduled_time: string;
    due_date: string;
  }) => {
    const newTask = await api.tasks.create({
      ...taskData,
      description: taskData.description || '',
      status: 'pending',
    });
    setTasks((prev) => [...prev, newTask]);
    showToast('Task added to your gentle flow ✨');
    // Refresh schedule and insights in background
    api.insights.get(7).then(setInsights).catch(() => {});
  };

  // Mood check-in action
  const handleCheckinSubmit = async (data: {
    mood: MoodType;
    energy_level: number;
    focus_level: number;
    note?: string;
  }) => {
    const res = await api.moodCheckins.create(data);
    setLatestCheckin(res.checkin);
    showToast(`Day tuned: ${res.paceNote} 🌿`);
    // Reload tasks to reflect re-tuned schedule
    loadData();
  };

  // Profile update action
  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    try {
      const updated = await api.profile.update(updates);
      setProfile(updated);
      showToast('Settings updated gently ✓');
    } catch (err) {
      console.error('Profile update failed:', err);
      loadData();
    }
  };

  // Chat message send
  const handleSendMessage = async (text: string) => {
    try {
      const res = await api.buddy.sendMessage(text);
      setChatMessages((prev) => [...prev, res.userMessage, res.buddyReply]);
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  // Notification mark read
  const handleMarkNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await api.notifications.markRead(id).catch(() => {});
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#E6D4BF]">
        <div className="w-full max-w-[420px]">
          <AuthScreen
            onSuccess={() => setIsAuthenticated(true)}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onGoogleLogin={handleGoogleLogin}
          />
        </div>
      </div>
    );
  }

  const unreadAlerts = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#231A0D] selection:bg-[#E78299] selection:text-white">
      {/* Mobile container centered on desktop with high-fidelity borders */}
      <div className="relative w-full max-w-[420px] min-h-screen sm:min-h-[844px] sm:max-h-[844px] overflow-hidden sm:rounded-[44px] shadow-2xl flex flex-col justify-between bg-[#F8F3ED]">
        {/* Render Active Screen */}
        <div className="flex-1 overflow-y-auto">
          {currentTab === 'home' && (
            <DailyFlowScreen
              tasks={tasks}
              latestCheckin={latestCheckin}
              profile={profile}
              onToggleTask={handleToggleTask}
              onOpenCheckin={() => setIsCheckinOpen(true)}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
              onOpenInsights={() => setIsInsightsOpen(true)}
              isLoading={loading}
            />
          )}

          {currentTab === 'chat' && (
            <SyncBuddyScreen
              messages={chatMessages}
              latestCheckin={latestCheckin}
              onSendMessage={handleSendMessage}
              onScheduleConfirmed={() => {
                showToast('Schedule adapted to gentle pace 🌸');
                loadData();
              }}
            />
          )}

          {currentTab === 'alerts' && (
            <NotificationsScreen
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onOpenScheduleNow={() => {
                setIsAddTaskOpen(true);
              }}
            />
          )}

          {currentTab === 'me' && (
            <ProfileScreen
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              onOpenAuth={() => setIsAuthenticated(false)}
            />
          )}
        </div>

        {/* Floating Bottom Navigation Bar */}
        <Navigation
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenAddTask={() => setIsAddTaskOpen(true)}
          unreadCount={unreadAlerts}
        />

        {/* Reassuring Toast Notification */}
        {feedbackToast && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#2D2833] text-white px-4 py-2 rounded-full text-xs font-bold shadow-cozy flex items-center gap-2 border border-white/20 animate-fade-in">
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* Modals */}
        <MoodCheckinModal
          isOpen={isCheckinOpen}
          onClose={() => setIsCheckinOpen(false)}
          onSubmit={handleCheckinSubmit}
          currentMood={latestCheckin?.mood || 'happy'}
          currentEnergy={latestCheckin?.energy_level || 4}
        />

        <NewTaskModal
          isOpen={isAddTaskOpen}
          onClose={() => setIsAddTaskOpen(false)}
          onSubmit={handleAddTask}
        />

        <InsightsModal
          isOpen={isInsightsOpen}
          onClose={() => setIsInsightsOpen(false)}
          insights={insights}
        />
      </div>
    </div>
  );
}
