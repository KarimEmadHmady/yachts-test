'use client';

import { useCallback, useEffect, useState } from 'react';
import { yachtSlugService } from '../api/yachtSlugService';
import type { Yacht } from '../types/Yacht.types';

interface UseYachtBySlugResult {
  yacht: Yacht | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useYachtBySlug = (slug: string): UseYachtBySlugResult => {
  const [yacht, setYacht] = useState<Yacht | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYacht = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await yachtSlugService.getBySlug(slug);
      setYacht(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Failed to fetch yacht',
      );
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchYacht();
  }, [fetchYacht]);

  return { yacht, isLoading, error, refetch: fetchYacht };
};