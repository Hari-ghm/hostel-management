const BASE = 'http://localhost:4000/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  getComplaints: (filters = {}) => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    );
    return req(`/complaints?${params}`);
  },
  getComplaint:   (id)   => req(`/complaints/${id}`),
  createComplaint:(data) => req('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  updateComplaint:(id, data) => req(`/complaints/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteComplaint:(id)   => req(`/complaints/${id}`, { method: 'DELETE' }),
  getStats:       ()     => req('/stats'),
};
