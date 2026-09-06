'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login, isLoading, error, clearAuthError, isAuthenticated, user } = useAuth();

  // لو المستخدم مسجل دخول، نوديه للداشبورد المناسب
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'manager') {
        router.push('/dashboard/funds-manager');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    }
  }, [isAuthenticated, user, router]);

  // لمسح الـ error لما المستخدم يبدأ يكتب
  useEffect(() => {
    if (error) {
      clearAuthError();
    }
  }, [email, password]);

  const handleSubmit = async () => {
    if (!email || !password) {
      return;
    }

    try {
      await login(email, password);
      // Redirect will be handled by useEffect when isAuthenticated updates
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !isLoading && email && password) {
      handleSubmit();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f7f7f7] dark:bg-[#0E2D4A] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-[#12395c] rounded-3xl shadow-xl overflow-hidden transition-colors">

          {/* Header Section */}
          <div className="bg-[#f7f7f7] dark:bg-[#012241] px-8 py-10 text-center border-b border-black/5 dark:border-white/10">
            <div className="w-40 h-16 flex items-center justify-center mx-auto mb-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={45}
                className="object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Welcome Back</h1>
            <p className="text-black/70 dark:text-white/80 text-sm">Sign in to continue to your dashboard</p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-10">
            <div className="space-y-6">

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-black dark:text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-black/40 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f7f7f7] dark:bg-[#0E2D4A] border border-black/10 dark:border-white/20 rounded-xl text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 focus:border-transparent focus:bg-white dark:focus:bg-[#12395c] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-black dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-black/40 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-3.5 bg-[#f7f7f7] dark:bg-[#0E2D4A] border border-black/10 dark:border-white/20 rounded-xl text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 focus:border-transparent focus:bg-white dark:focus:bg-[#12395c] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center disabled:opacity-50"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-black/40 dark:text-white/50 hover:text-black/60 dark:hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-black/40 dark:text-white/50 hover:text-black/60 dark:hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={isLoading}
                    className="w-4 h-4 text-black dark:text-white border-black/20 dark:border-white/30 rounded focus:ring-black/30 dark:focus:ring-white/30 focus:ring-2 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-black/70 dark:text-white/70">Remember me</span>
                </label>
                <Link href="/login/forgot-password">
                  <button
                    type="button"
                    disabled={isLoading}
                    className="text-sm font-semibold text-black dark:text-white hover:underline transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </Link>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !email || !password}
                className="w-full bg-black dark:bg-white text-white dark:text-[#0E2D4A] py-3.5 px-4 rounded-xl font-semibold hover:bg-black/80 dark:hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 dark:shadow-white/10"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center text-xs text-black/60 dark:text-white/60">
          By signing in, you agree to our{' '}
          <span className="font-semibold text-black dark:text-white hover:underline cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="font-semibold text-black dark:text-white hover:underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}