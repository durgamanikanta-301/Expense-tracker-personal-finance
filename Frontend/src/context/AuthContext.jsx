import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'

const TOKEN_KEY = 'finflow_token'
const USER_KEY  = 'finflow_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount: validate stored token via GET /api/auth/profile
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) { setIsLoading(false); return }
      try {
        const profile = await authService.getProfile()
        setUser(profile)
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      } finally {
        setIsLoading(false)
      }
    }
    restore()
  }, [])

  const login = useCallback(async (data) => {
    const res = await authService.login(data)
    localStorage.setItem(TOKEN_KEY, res.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.user))
    setUser(res.user)
  }, [])

  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    localStorage.setItem(TOKEN_KEY, res.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.user))
    setUser(res.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const updateUser = useCallback((updated) => {
    setUser(updated)
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
