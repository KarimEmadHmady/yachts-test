'use client';

import { useCallback, useState } from 'react';
import { amenityService } from '@/services/amenityService';

export function useAmenities() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAmenities = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await amenityService.list();
      setAmenities(Array.isArray(result) ? result : []);
      return result;
    } catch (requestError) {
      setError(requestError.message || 'Failed to fetch amenities');
      setAmenities([]);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAmenity = useCallback(async (payload, token) => {
    const response = await amenityService.create(payload, token);
    await fetchAmenities();
    return response;
  }, [fetchAmenities]);

  const updateAmenity = useCallback(async (id, payload, token) => {
    const response = await amenityService.update(id, payload, token);
    await fetchAmenities();
    return response;
  }, [fetchAmenities]);

  const deleteAmenity = useCallback(async (id, token) => {
    const response = await amenityService.delete(id, token);
    await fetchAmenities();
    return response;
  }, [fetchAmenities]);

  return {
    amenities,
    loading,
    error,
    setAmenities,
    fetchAmenities,
    createAmenity,
    updateAmenity,
    deleteAmenity,
  };
}
