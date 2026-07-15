import api from './api'

export const dashboardService = {
  getDashboard: async () => {
    const r = await api.get('/dashboard')
    return r.data.data
  },
}
