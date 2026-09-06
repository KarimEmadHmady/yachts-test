'use client';

import { useCallback, useState } from 'react';

export function useUsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      if (!token) {
        console.warn('No auth token found for fetching users');
        setUsers([]);
        setLoading(false);
        return [];
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://revamp.yachts-odin.com/yachts'}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      const usersList = Array.isArray(data) ? data : (data.users || data.data || []);
      
      setUsers(usersList);
      return usersList;
    } catch (requestError) {
      console.error('Error fetching users:', requestError);
      setError(requestError.message || 'Failed to fetch users');
      setUsers([]);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    setUsers,
    fetchUsers,
  };
}
