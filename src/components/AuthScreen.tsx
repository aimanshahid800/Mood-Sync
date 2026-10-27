import React, { useState } from 'react';

interface AuthScreenProps {
  onSuccess: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onSignup: (email: string, pass: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  onLogin,
  onSignup,
  onGoogleLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('maya@mindfulday.com');
  const [password, setPassword] = useState('cozyflow2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        await onSignup(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await onGoogleLogin();
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#E6D4BF] text-[#2D2833] relative overflow-hidden flex flex-col justify-between selection:bg-[#E78299] selection:text-white">
      {/* iOS Status Bar */}
      <header className="w-full pt-3 px-7 flex justify-between items-center z-20 text-[#5a483a]">
        <span className="text-[15px] font-bold tracking-tight">9:41</span>
        <div className="w-24 h-4 bg-[#d8c3a9]/50 rounded-full" />
        <div className="flex items-center space-x-1.5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z" />
          </svg>
          <div className="w-5 h-2.5 border-2 border-[#5a483a] rounded-sm p-0.5 flex items-center">
            <div className="h-full w-full bg-[#5a483a] rounded-2xs" />
          </div>
        </div>
      </header>

      {/* Ambient background circles */}
      <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#f0e3d2] rounded-full opacity-60 pointer-events-none" />
      <div className="absolute top-24 -right-12 w-36 h-36 bg-[#dfcbaf] rounded-full opacity-50 pointer-events-none" />
      <div className="absolute top-48 left-6 w-3 h-3 bg-[#E78299]/40 rounded-full pointer-events-none" />

      {/* TOP HALF: Illustration & Gentle Warm Brand Presence */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-1 pb-3">
        {/* Mini Brand Pill Indicator */}
        <div className="flex items-center gap-1.5 bg-[#FFFDF9]/90 px-3 py-1 rounded-full text-xs font-semibold text-[#5c4b6e] mb-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#E78299] animate-pulse" />
          <span className="tracking-wide uppercase text-[10px] font-bold">Gentle Daily Start</span>
        </div>

        {/* Warm Human Illustration */}
        <div className="w-full max-w-[280px] h-[180px] relative rounded-2xl overflow-hidden shadow-cozy-card border-2 border-white/60 bg-[#F5ECE1] flex items-center justify-center">
          <img
            src="/assets/aistudio/Image_18_805aa054.jpeg"
            alt="Person waking up unhurried in cozy bed"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // fallback to colored cozy placeholder
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Brand Tagline */}
        <div className="text-center mt-2.5">
          <h1 className="text-xl font-bold text-[#4b3c32] tracking-tight">
            Welcome to <span className="text-[#5c4b6e]">MoodSync</span>
          </h1>
          <p className="text-[12px] font-medium text-[#7a6557] mt-0.5">
            Tune your day to your rhythm, gently &amp; unhurried.
          </p>
        </div>
      </section>

      {/* BOTTOM HALF: Solid Ivory / Warm Cream Rounded Card */}
      <section className="relative z-10 w-full bg-[#FFFDF9] rounded-t-[36px] shadow-nav border-t border-[#f2e6d6] px-6 pt-4 pb-6 flex flex-col">
        {/* Tactile Card Handle Indicator */}
        <div className="w-10 h-1 bg-[#decbba] rounded-full mx-auto mb-3" />

        {/* Segmented Toggle */}
        <div className="w-full bg-[#F5ECE1] p-1 rounded-full flex items-center mb-3 shadow-inner">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded-full text-center text-xs font-bold transition-all duration-200 ${
              mode === 'login'
                ? 'bg-[#FFFDF9] text-[#5c4b6e] shadow-sm'
                : 'text-[#786960] hover:text-[#5c4b6e]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 rounded-full text-center text-xs font-bold transition-all duration-200 ${
              mode === 'signup'
                ? 'bg-[#FFFDF9] text-[#5c4b6e] shadow-sm'
                : 'text-[#786960] hover:text-[#5c4b6e]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="mb-2 p-2 bg-red-50 text-red-700 text-xs font-bold rounded-xl text-center border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 mb-3">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-[#655345] mb-1 ml-3">
              Email address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#877499]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maya@mindfulday.com"
                className="w-full bg-[#FAF5EE] text-[#4b3c32] text-xs font-medium pl-10 pr-4 py-2.5 rounded-full border border-[#decbba] focus:outline-none focus:border-[#E78299] transition-all shadow-inner placeholder-[#ab9a8e]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1 px-3">
              <label className="text-[11px] font-bold text-[#655345]">Password</label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="text-[10px] font-semibold text-[#877499] hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#877499]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FAF5EE] text-[#4b3c32] text-xs font-medium pl-10 pr-10 py-2.5 rounded-full border border-[#decbba] focus:outline-none focus:border-[#E78299] transition-all shadow-inner tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 text-[#a39082] hover:text-[#877499]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Primary Action Button: Solid Candy */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#E78299] hover:bg-[#dc6e88] active:scale-[0.99] text-white py-3 rounded-full font-bold text-sm tracking-wide shadow-cozy-card flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Entering...' : mode === 'login' ? 'Continue' : 'Create Gentle Account'}</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1 mb-2">
          <div className="border-t border-[#ebd8c5] w-full" />
          <span className="bg-[#FFFDF9] px-3 text-[10px] font-semibold text-[#9e8c80] uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* Google Auth Button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full bg-[#FAF5EE] hover:bg-[#F3ECE0] active:scale-[0.99] text-[#4b3c32] py-2.5 px-4 rounded-full font-bold text-xs border border-[#decbba] flex items-center justify-center gap-2.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-[10px] text-[#9e8c80] mt-3 font-medium">
          By joining, you embrace our gentle Care Policy &amp; Privacy Nook.
        </p>

        <div className="w-32 h-1 bg-[#decbba] rounded-full mx-auto mt-2" />
      </section>
    </div>
  );
};
