const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BLOGS_ENDPOINT = `${API_URL}/api/blogs`;

const getErrorMessage = async (response, fallback) => {
  try {
    const error = await response.json();
    return error.message || fallback;
  } catch {
    return fallback;
  }
};

const request = async (url, fallback, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(await getErrorMessage(response, fallback));
  return response.json();
};

const buildBlogFormData = (payload, images = []) => {
  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value);
  });

  images.forEach((image) => {
    if (image) formData.append('images', image);
  });

  return formData;
};

export const blogService = {
  list() {
    return request(BLOGS_ENDPOINT, 'Failed to fetch blogs');
  },

  getById(id) {
    return request(`${BLOGS_ENDPOINT}/${encodeURIComponent(id)}`, 'Failed to fetch blog');
  },

  create(payload, images, token) {
    const body = buildBlogFormData(payload, images);

    return request(`${BLOGS_ENDPOINT}`, 'Failed to create blog', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
  },

  update(id, payload, images, token) {
    const body = buildBlogFormData(payload, images);

    return request(`${BLOGS_ENDPOINT}/${encodeURIComponent(id)}`, 'Failed to update blog', {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
  },

  delete(id, token) {
    return request(`${BLOGS_ENDPOINT}/${encodeURIComponent(id)}`, 'Failed to delete blog', {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};