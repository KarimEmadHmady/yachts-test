'use client';


import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setCredentials, logout } from '@/redux/features/auth/authSlice';

export default function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ user, token }));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    // لو مفيش توكن، الـ state بيفضل زي ما هو (مش مسجل دخول) فمحتاجين
    // نعمل حاجة، الـ initialState أصلاً كده.
  }, [dispatch]);

  return null;
}