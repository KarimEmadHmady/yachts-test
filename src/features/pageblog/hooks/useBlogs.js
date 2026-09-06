'use client';

import { useCallback, useEffect, useState } from 'react';
import { blogService } from '../api/blogService';

export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setBlogs(await blogService.list());
    } catch (requestError) {
      setError(requestError.message || 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, isLoading, error, fetchBlogs };
}