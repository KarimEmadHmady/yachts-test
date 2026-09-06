'use client';

import { useCallback, useState } from 'react';
import { yachtService } from '../api/yachtService';
import { getAuthToken } from '../utils/yacht.utils';

export const useYachts = () => {
  const [yachts, setYachts] = useState([]);
  const [yacht, setYacht] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (operation) => {
    setIsLoading(true);
    setError(null);
    try {
      return await operation();
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchYachts = useCallback((filters = {}) => run(async () => {
    const result = await yachtService.list(filters, getAuthToken());
    setYachts(result);
    return result;
  }), [run]);

  const fetchYachtBySlug = useCallback((slug) => run(async () => {
    const result = await yachtService.getBySlug(slug, getAuthToken());
    setYacht(result);
    return result;
  }), [run]);

  const submitYacht = useCallback((formData) => run(() => yachtService.submit(formData)), [run]);
  const createYacht = useCallback((data) => run(() => yachtService.create(data, getAuthToken())), [run]);
  const updateYacht = useCallback((id, data) => run(() => yachtService.update(id, data, getAuthToken())), [run]);
  const updateYachtStatus = useCallback((id, status) => run(() => yachtService.updateStatus(id, status, getAuthToken())), [run]);
  const deleteYacht = useCallback((id) => run(() => yachtService.remove(id, getAuthToken())), [run]);
  const uploadYachtImages = useCallback((id, formData) => run(() => yachtService.addImages(id, formData, getAuthToken())), [run]);
  const updateSpecifications = useCallback((id, specifications) => run(() => yachtService.replaceSpecifications(id, specifications, getAuthToken())), [run]);
  const updateAmenities = useCallback((id, amenityIds) => run(() => yachtService.setAmenities(id, amenityIds, getAuthToken())), [run]);

  return {
    yachts,
    yacht,
    isLoading,
    error,
    fetchYachts,
    fetchYachtBySlug,
    submitYacht,
    createYacht,
    updateYacht,
    updateYachtStatus,
    deleteYacht,
    uploadYachtImages,
    updateSpecifications,
    updateAmenities,
    clearError: () => setError(null),
  };
};