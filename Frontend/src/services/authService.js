import api from './api'

export const authService = {
  login: async (data) => {
    const res = await api.post('/auth/login', data)
    return res.data.data
  },
  register: async (data) => {
    const res = await api.post('/auth/register', data)
    return res.data.data
  },
  getProfile: async () => {
    const res = await api.get('/auth/profile')
    return res.data.data
  },
  updateProfile: async (data) => {
    const res = await api.patch('/auth/profile', data)
    return res.data.data
  },
}
