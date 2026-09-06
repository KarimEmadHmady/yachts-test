'use client';

import { useCallback, useState } from 'react';
import { blogService } from '../api/blogService';

export function useAdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await blogService.list();
      setBlogs(Array.isArray(result) ? result : []);
      return result;
    } catch (requestError) {
      setError(requestError.message || 'Failed to fetch blogs');
      setBlogs([]);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBlog = useCallback(async (payload, images, token) => {
    const response = await blogService.create(payload, images, token);
    await fetchBlogs();
    return response;
  }, [fetchBlogs]);

  const updateBlog = useCallback(async (id, payload, images, token) => {
    const response = await blogService.update(id, payload, images, token);
    await fetchBlogs();
    return response;
  }, [fetchBlogs]);

  const deleteBlog = useCallback(async (id, token) => {
    const response = await blogService.delete(id, token);
    await fetchBlogs();
    return response;
  }, [fetchBlogs]);

  return {
    blogs,
    isLoading,
    error,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
