// app/forgot-password/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const {
    isLoading,
    error,
    resetEmailSent,
    requestPasswordReset,
    clearAuthError,
    clearResetStates
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Clear states when entering the page
    clearResetStates();
    clearAuthError();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    try {
      await requestPasswordReset(email);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (resetEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] dark:bg-[#0E2D4A] px-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-[#12395c] rounded-3xl shadow-lg p-8 text-center transition-colors">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
            Email Sent Successfully!
          </h2>
          <p className="text-black/70 dark:text-white/70 mb-6">
            Password reset link has been sent to {email}.
            Please check your email inbox.
          </p>
          <Link
            href="/login"
            className="inline-block bg-black dark:bg-white text-white dark:text-[#0E2D4A] px-6 py-2 rounded-lg hover:bg-black/80 dark:hover:bg-white/90 transition-colors font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] dark:bg-[#0E2D4A] px-4 transition-colors">

      <div className="max-w-md w-full bg-white dark:bg-[#12395c] shadow-lg rounded-3xl transition-colors">
        {/* Header Section */}
        <div className="bg-[#f7f7f7] dark:bg-[#0E2D4A] px-8 py-10 text-center rounded-t-3xl border-b border-black/5 dark:border-white/10">
          <div className="w-32 h-16 flex items-center justify-center mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={40}
              className="object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Forgot Your Password?</h1>
          <p className="text-black/70 dark:text-white/80 text-sm">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#f7f7f7] dark:bg-[#0E2D4A] border border-black/10 dark:border-white/20 rounded-lg text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 focus:border-transparent outline-none transition disabled:bg-black/5 dark:disabled:bg-white/5 disabled:cursor-not-allowed"
              placeholder="Enter your email address"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-black dark:bg-white text-white dark:text-[#0E2D4A] py-3 rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition disabled:bg-black/30 dark:disabled:bg-white/30 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-black dark:text-white hover:underline text-sm font-medium transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;