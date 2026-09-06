'use client';

import { useCallback, useState } from 'react';
import { brandService } from '@/services/brandService';

export function useBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await brandService.list();
      setBrands(Array.isArray(result) ? result : []);
      return result;
    } catch (requestError) {
      setError(requestError.message || 'Failed to fetch brands');
      setBrands([]);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBrand = useCallback(async (payload, token) => {
    const response = await brandService.create(payload, token);
    await fetchBrands();
    return response;
  }, [fetchBrands]);

  const updateBrand = useCallback(async (id, payload, token) => {
    const response = await brandService.update(id, payload, token);
    await fetchBrands();
    return response;
  }, [fetchBrands]);

  const deleteBrand = useCallback(async (id, token) => {
    const response = await brandService.delete(id, token);
    await fetchBrands();
    return response;
  }, [fetchBrands]);

  return {
    brands,
    loading,
    error,
    setBrands,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  };
}
