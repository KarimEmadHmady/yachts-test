'use client';
// src/redux/ReduxProvider.tsx
import { Provider } from 'react-redux';
import { store } from './store';
import AuthHydrator from '@/features/auth/components/Authhydrator';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><AuthHydrator />{children}</Provider>;
} 