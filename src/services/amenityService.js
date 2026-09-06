const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts';

const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const amenityService = {
  async list() {
    const response = await fetch(`${API_URL}/api/amenities`);
    if (!response.ok) throw new Error('Failed to fetch amenities');
    return response.json();
  },

  async getById(id, token) {
    const response = await fetch(`${API_URL}/api/amenities/${id}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch amenity');
    return response.json();
  },

  async create(payload, token) {
    const response = await fetch(`${API_URL}/api/amenities`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create amenity');
    }

    return response.json();
  },

  async update(id, payload, token) {
    const response = await fetch(`${API_URL}/api/amenities/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update amenity');
    }

    return response.json();
  },

  async delete(id, token) {
    const response = await fetch(`${API_URL}/api/amenities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to delete amenity');
    }

    return response.json();
  },
};
