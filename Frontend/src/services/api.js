import axios from 'axios'
import { toast } from 'sonner'

// In production (Vercel): set VITE_API_BASE_URL = https://your-backend.onrender.com/api
// In local dev: falls back to '/api' which Vite proxy (vite.config.js) routes to http://localhost:8080
// No .env file needed for local development — works out of the box after git clone!
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finflow_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message

    if (status === 401) {
      localStorage.removeItem('finflow_token')
      localStorage.removeItem('finflow_user')
      toast.error('Session expired. Please log in again.')
      setTimeout(() => { window.location.href = '/login' }, 1500)
    } else if (status === 403) {
      toast.error('You do not have permission to do that.')
    } else if (status === 500) {
      toast.error('Server error. Please try again later.')
    } else if (!error.response) {
      toast.error('Network error. Check your connection.')
    }

    return Promise.reject(error)
  }
)

export default api
