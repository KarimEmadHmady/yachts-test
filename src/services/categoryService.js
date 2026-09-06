const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts';

const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const categoryService = {
  async list() {
    const response = await fetch(`${API_URL}/api/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async getById(id, token) {
    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  },

  async create(payload, token) {
    const isFormData = payload instanceof FormData;
    const response = await fetch(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: isFormData ? { ...(token ? { Authorization: `Bearer ${token}` } : {}) } : getAuthHeaders(token),
      body: isFormData ? payload : JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create category');
    }

    return response.json();
  },

  async update(id, payload, token) {
    const isFormData = payload instanceof FormData;
    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: isFormData ? { ...(token ? { Authorization: `Bearer ${token}` } : {}) } : getAuthHeaders(token),
      body: isFormData ? payload : JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update category');
    }

    return response.json();
  },

  async delete(id, token) {
    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to delete category');
    }

    return response.json();
  },
};
