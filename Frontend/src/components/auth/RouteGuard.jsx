import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

function LoadingDots() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

/** Blocks unauthenticated users → /login */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <LoadingDots />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

/** Blocks authenticated users from /login and /register → /dashboard */
export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <LoadingDots />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
