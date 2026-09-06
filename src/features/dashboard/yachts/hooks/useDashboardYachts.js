'use client';

import { useCallback, useState } from 'react';
import { dashboardYachtService } from '../services/yachtService';

export function useDashboardYachts() {
  const [yachts, setYachts] = useState([]);
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = () => (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);

  const run = useCallback(async (operation) => {
    setLoading(true);
    setError('');
    try {
      return await operation();
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong');
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchYachts = useCallback((filters = {}) => run(async () => {
    const result = await dashboardYachtService.list(token(), filters);
    setYachts(Array.isArray(result) ? result : []);
    return result;
  }), [run]);

  const fetchYachtById = useCallback(async (id) => {
    const result = await dashboardYachtService.getById(id, token());
    setSelectedYacht(result || null);
    return result;
  }, []);

  const fetchYachtBySlug = useCallback(async (slug) => {
    const result = await dashboardYachtService.getBySlug(slug, token());
    setSelectedYacht(result || null);
    return result;
  }, []);

  const createYacht = useCallback((payload) => run(async () => {
    const result = await dashboardYachtService.create(payload, token());
    await fetchYachts();
    return result;
  }), [fetchYachts, run]);

  const updateYacht = useCallback((id, payload) => run(async () => {
    const result = await dashboardYachtService.update(id, payload, token());
    await fetchYachts();
    if (selectedYacht?.id === id) {
      setSelectedYacht({ ...selectedYacht, ...payload });
    }
    return result;
  }), [fetchYachts, run, selectedYacht]);

  const updateStatus = useCallback((id, status) => run(async () => {
    const result = await dashboardYachtService.updateStatus(id, status, token());
    await fetchYachts();
    return result;
  }), [fetchYachts, run]);

  const deleteYacht = useCallback((id) => run(async () => {
    const result = await dashboardYachtService.delete(id, token());
    await fetchYachts();
    if (selectedYacht?.id === id) setSelectedYacht(null);
    return result;
  }), [fetchYachts, run, selectedYacht]);

  const uploadImages = useCallback((id, formData) => run(async () => {
    const result = await dashboardYachtService.addImages(id, formData, token());
    await fetchYachtById(id);
    return result;
  }), [fetchYachtById, run]);

  const updateSpecifications = useCallback((id, specifications) => run(async () => {
    const result = await dashboardYachtService.replaceSpecifications(id, specifications, token());
    await fetchYachtById(id);
    return result;
  }), [fetchYachtById, run]);

  const updateAmenities = useCallback((id, amenityIds) => run(async () => {
    const result = await dashboardYachtService.setAmenities(id, amenityIds, token());
    await fetchYachtById(id);
    return result;
  }), [fetchYachtById, run]);

  return {
    yachts,
    selectedYacht,
    loading,
    error,
    setSelectedYacht,
    fetchYachts,
    fetchYachtById,
    fetchYachtBySlug,
    createYacht,
    updateYacht,
    updateStatus,
    deleteYacht,
    uploadImages,
    updateSpecifications,
    updateAmenities,
  };
}
