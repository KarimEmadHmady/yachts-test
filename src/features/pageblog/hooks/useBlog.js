'use client';

import { useEffect, useState } from 'react';
import { blogService } from '../api/blogService';

export function useBlog(id) {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const fetchBlog = async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await blogService.getById(id);
        if (isActive) setBlog(result);
      } catch (requestError) {
        if (isActive) setError(requestError.message || 'Failed to fetch blog');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    if (id) fetchBlog();
    return () => {
      isActive = false;
    };
  }, [id]);

  return { blog, isLoading, error };
}