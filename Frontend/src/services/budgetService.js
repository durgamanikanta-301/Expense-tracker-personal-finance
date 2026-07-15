import api from './api'

export const budgetService = {
  getAll: async () => { const r = await api.get('/budgets'); return r.data.data },
  getById: async (id) => { const r = await api.get(`/budgets/${id}`); return r.data.data },
  getByPeriod: async (month, year) => { const r = await api.get('/budgets/filter/period', { params: { month, year } }); return r.data.data },
  create: async (data) => { const r = await api.post('/budgets', data); return r.data.data },
  update: async (id, data) => { const r = await api.put(`/budgets/${id}`, data); return r.data.data },
  delete: async (id) => { await api.delete(`/budgets/${id}`) },
}
