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
  getRooms:       ()     => req('/rooms'),
  allocateRoom:   (id, data) => req(`/rooms/${id}/allocate`, { method: 'PATCH', body: JSON.stringify(data) }),
  getMessMenus:   ()     => req('/mess'),
  getAnnouncements:()    => req('/announcements'),
  createAnnouncement:(d) => req('/announcements', { method: 'POST', body: JSON.stringify(d) }),
  getVisitors:    ()     => req('/visitors'),
  getFees:        ()     => req('/fees'),
  payFee:         (id)   => req(`/fees/${id}/pay`, { method: 'PATCH', body: JSON.stringify({}) }),
};
