// src/api.js
//
// Thin fetch wrapper around the backend API.
// The base URL comes from an env var so the same build works against
// localhost in dev and the deployed Render/Railway URL in production.
// Set VITE_API_URL in a .env file (see .env.example).

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = body?.error || `Request failed (${res.status})`;
    const error = new Error(message);
    error.details = body?.details;
    throw error;
  }
  return body;
}

export const api = {
  getEquipment: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/api/equipment${qs ? `?${qs}` : ''}`);
  },
  getStats: () => request('/api/stats'),
  createEquipment: (payload) =>
    request('/api/equipment', { method: 'POST', body: JSON.stringify(payload) }),
  updateEquipment: (id, payload) =>
    request(`/api/equipment/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteEquipment: (id) => request(`/api/equipment/${id}`, { method: 'DELETE' }),
  importCsv: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/api/equipment/import`, {
      method: 'POST',
      body: formData,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || 'Import failed');
    return body;
  },
};
