import type { Yacht } from '../types/Yacht.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const YACHTS_ENDPOINT = `${API_URL}/api/yachts`;

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const error = await response.json();
    return error.message || fallback;
  } catch {
    return fallback;
  }
};

export const yachtSlugService = {
  async getBySlug(slug: string, token?: string | null): Promise<Yacht> {
    const response = await fetch(
      `${YACHTS_ENDPOINT}/slug/${encodeURIComponent(slug)}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    );

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to fetch yacht'));
    }

    return response.json();
  },
};