import api from './api'

export const expenseService = {
  getAll: async () => { const r = await api.get('/expenses'); return r.data.data },
  getById: async (id) => { const r = await api.get(`/expenses/${id}`); return r.data.data },
  create: async (data) => { const r = await api.post('/expenses', data); return r.data.data },
  update: async (id, data) => { const r = await api.put(`/expenses/${id}`, data); return r.data.data },
  delete: async (id) => { await api.delete(`/expenses/${id}`) },
  getByType: async (type) => { const r = await api.get('/expenses/filter/type', { params: { type } }); return r.data.data },
  getByCategory: async (category) => { const r = await api.get('/expenses/filter/category', { params: { category } }); return r.data.data },
  getByDateRange: async (startDate, endDate) => { const r = await api.get('/expenses/filter/date', { params: { startDate, endDate } }); return r.data.data },
  getByMonth: async (month, year) => { const r = await api.get('/expenses/filter/month', { params: { month, year } }); return r.data.data },
  getByYear: async (year) => { const r = await api.get('/expenses/filter/year', { params: { year } }); return r.data.data },
}
