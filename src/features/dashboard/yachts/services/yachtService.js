const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts';
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
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, fallback));
  }
  return response.json();
};

const authHeaders = (token) => ({
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const jsonOptions = (method, token, body) => ({
  method,
  headers: {
    ...authHeaders(token),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const multipartOptions = (method, token, formData) => ({
  method,
  headers: authHeaders(token),
  body: formData,
});

export const dashboardYachtService = {
  list(token, filters = {}) {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });

    const url = query.toString() ? `${YACHTS_ENDPOINT}?${query}` : YACHTS_ENDPOINT;
    return request(url, { headers: authHeaders(token) }, 'Failed to fetch yachts');
  },

  getById(id, token) {
    return request(
      `${YACHTS_ENDPOINT}/${id}`,
      { headers: authHeaders(token) },
      'Failed to fetch yacht',
    );
  },

  getBySlug(slug, token) {
    return request(
      `${YACHTS_ENDPOINT}/slug/${encodeURIComponent(slug)}`,
      { headers: authHeaders(token) },
      'Failed to fetch yacht',
    );
  },

  create(payload, token) {
    const isFormData = payload instanceof FormData;
    return request(
      YACHTS_ENDPOINT,
      isFormData ? multipartOptions('POST', token, payload) : jsonOptions('POST', token, payload),
      'Failed to create yacht',
    );
  },

  update(id, payload, token) {
    return request(
      `${YACHTS_ENDPOINT}/${id}`,
      jsonOptions('PUT', token, payload),
      'Failed to update yacht',
    );
  },

  updateStatus(id, status, token) {
    return request(
      `${YACHTS_ENDPOINT}/${id}/status`,
      jsonOptions('PATCH', token, { status }),
      'Failed to update yacht status',
    );
  },

  delete(id, token) {
    return request(
      `${YACHTS_ENDPOINT}/${id}`,
      {
        method: 'DELETE',
        headers: authHeaders(token),
      },
      'Failed to delete yacht',
    );
  },

  addImages(id, formData, token) {
    return request(
      `${YACHTS_ENDPOINT}/${id}/images`,
      multipartOptions('POST', token, formData),
      'Failed to upload yacht images',
    );
  },

  replaceSpecifications(id, specifications, token) {
    return request(
      `${YACHTS_ENDPOINT}/${id}/specifications`,
      jsonOptions('PUT', token, { specifications }),
      'Failed to update yacht specifications',
    );
  },

  setAmenities(id, amenityIds, token) {
    return request(
      `${YACHTS_ENDPOINT}/${id}/amenities`,
      jsonOptions('PUT', token, { amenityIds }),
      'Failed to update yacht amenities',
    );
  },
};
