const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts';
const SUBMISSIONS_ENDPOINT = `${API_URL}/api/dashboard/submissions`;

const getErrorMessage = async (response, fallback) => {
  try {
    const error = await response.json();
    return error.message || fallback;
  } catch {
    return fallback;
  }
};

const request = async (url, options = {}, fallback = 'Failed to process submission request') => {
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

export const dashboardSubmissionService = {
  list(status = null, token) {
    const url = status ? `${SUBMISSIONS_ENDPOINT}?status=${encodeURIComponent(status)}` : SUBMISSIONS_ENDPOINT;
    return request(url, { headers: authHeaders(token) }, 'Failed to fetch submissions');
  },

  getById(id, token) {
    return request(`${SUBMISSIONS_ENDPOINT}/${id}`, { headers: authHeaders(token) }, 'Failed to fetch submission details');
  },

  approve(id, token) {
    return request(
      `${SUBMISSIONS_ENDPOINT}/${id}/approve`,
      jsonOptions('PATCH', token, {}),
      'Failed to approve submission',
    );
  },

  reject(id, comment, token) {
    return request(
      `${SUBMISSIONS_ENDPOINT}/${id}/reject`,
      jsonOptions('PATCH', token, { comment }),
      'Failed to reject submission',
    );
  },
};
