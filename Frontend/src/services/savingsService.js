import api from './api'

export const savingsService = {
  getAll: async () => { const r = await api.get('/savings-goals'); return r.data.data },
  getById: async (id) => { const r = await api.get(`/savings-goals/${id}`); return r.data.data },
  getActive: async () => { const r = await api.get('/savings-goals/active'); return r.data.data },
  getCompleted: async () => { const r = await api.get('/savings-goals/completed'); return r.data.data },
  create: async (data) => { const r = await api.post('/savings-goals', data); return r.data.data },
  update: async (id, data) => { const r = await api.put(`/savings-goals/${id}`, data); return r.data.data },
  // amount sent as query param (backend uses @RequestParam BigDecimal)
  addContribution: async (id, amount) => {
    const r = await api.patch(`/savings-goals/${id}/contribute`, null, { params: { amount } })
    return r.data.data
  },
  delete: async (id) => { await api.delete(`/savings-goals/${id}`) },
}
