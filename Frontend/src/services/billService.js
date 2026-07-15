import api from './api'

export const billService = {
  getAll: async () => { const r = await api.get('/bills'); return r.data.data },
  getById: async (id) => { const r = await api.get(`/bills/${id}`); return r.data.data },
  getUnpaid: async () => { const r = await api.get('/bills/unpaid'); return r.data.data },
  getPaid: async () => { const r = await api.get('/bills/paid'); return r.data.data },
  getUpcoming: async (daysAhead = 30) => { const r = await api.get('/bills/upcoming', { params: { daysAhead } }); return r.data.data },
  create: async (data) => { const r = await api.post('/bills', data); return r.data.data },
  update: async (id, data) => { const r = await api.put(`/bills/${id}`, data); return r.data.data },
  markAsPaid: async (id) => { const r = await api.patch(`/bills/${id}/pay`); return r.data.data },
  delete: async (id) => { await api.delete(`/bills/${id}`) },
}
