'use client';

import { useCallback, useState } from 'react';
import { categoryService } from '@/services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async (brandId) => {
    setLoading(true);
    setError('');

    try {
      const result = await categoryService.list(brandId);
      setCategories(Array.isArray(result) ? result : []);
      return result;
    } catch (requestError) {
      setError(requestError.message || 'Failed to fetch categories');
      setCategories([]);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (payload, token) => {
    const response = await categoryService.create(payload, token);
    await fetchCategories(payload.brand_ids?.[0] || payload.brand_id);
    return response;
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id, payload, token) => {
    const response = await categoryService.update(id, payload, token);
    await fetchCategories(payload.brand_ids?.[0] || payload.brand_id);
    return response;
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id, token) => {
    const response = await categoryService.delete(id, token);
    await fetchCategories();
    return response;
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    setCategories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
