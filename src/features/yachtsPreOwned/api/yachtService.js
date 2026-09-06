const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const YACHTS_ENDPOINT = `${API_URL}/api/yachts`;

const getErrorMessage = async (response, fallback) => {
  try {
    const error = await response.json();
    return error.message || fallback;
  } catch {
    return fallback;
  }
};

const request = async (url, options = {}, fallback = 'Yacht request failed') => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(await getErrorMessage(response, fallback));
  return response.json();
};

const jsonOptions = (method, token, body) => ({
  method,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const multipartOptions = (method, token, body) => ({
  method,
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  body,
});

export const yachtService = {
  list(filters = {}, token) {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
    });
    return request(
      query.toString() ? `${YACHTS_ENDPOINT}?${query}` : YACHTS_ENDPOINT,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      'Failed to fetch yachts',
    );
  },

  getBySlug(slug, token) {
    return request(
      `${YACHTS_ENDPOINT}/slug/${encodeURIComponent(slug)}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      'Failed to fetch yacht',
    );
  },

  submit(formData) {
    return request(`${YACHTS_ENDPOINT}/submit`, multipartOptions('POST', null, formData), 'Failed to submit yacht');
  },

  create(data, token) {
    const options = data instanceof FormData
      ? multipartOptions('POST', token, data)
      : jsonOptions('POST', token, data);
    return request(`${YACHTS_ENDPOINT}`, options, 'Failed to create yacht');
  },

  update(id, data, token) {
    return request(`${YACHTS_ENDPOINT}/${id}`, jsonOptions('PUT', token, data), 'Failed to update yacht');
  },

  updateStatus(id, status, token) {
    return request(`${YACHTS_ENDPOINT}/${id}/status`, jsonOptions('PATCH', token, { status }), 'Failed to update yacht status');
  },

  remove(id, token) {
    return request(`${YACHTS_ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }, 'Failed to delete yacht');
  },

  addImages(id, formData, token) {
    return request(`${YACHTS_ENDPOINT}/${id}/images`, multipartOptions('POST', token, formData), 'Failed to upload yacht images');
  },

  replaceSpecifications(id, specifications, token) {
    return request(`${YACHTS_ENDPOINT}/${id}/specifications`, jsonOptions('PUT', token, { specifications }), 'Failed to update yacht specifications');
  },

  setAmenities(id, amenityIds, token) {
    return request(`${YACHTS_ENDPOINT}/${id}/amenities`, jsonOptions('PUT', token, { amenityIds }), 'Failed to update yacht amenities');
  },
};