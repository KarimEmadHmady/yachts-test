const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts';
const API_BASE = `${API_URL}/api`;

const post = async (path, body, fallback) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || fallback);
  }
  return response.json();
};

export const leadService = {
  createEnquiry: (data) => post('/enquiries', data, 'Failed to send enquiry'),
  createSubscription: (data) => post('/subscriptions', data, 'Failed to subscribe'),
  async getEnquiries(token) {
    const response = await fetch(`${API_BASE}/enquiries`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error('Failed to load enquiries');
    return response.json();
  },
  async getSubscriptions(token) {
    const response = await fetch(`${API_BASE}/subscriptions`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error('Failed to load subscriptions');
    return response.json();
  },
};
