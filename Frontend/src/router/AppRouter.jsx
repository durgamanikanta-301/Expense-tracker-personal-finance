import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProtectedRoute, PublicRoute } from '@/components/auth/RouteGuard'
import { Login } from '@/pages/Login/Login'
import { Register } from '@/pages/Register/Register'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { Expenses } from '@/pages/Expenses/Expenses'
import { Budgets } from '@/pages/Budgets/Budgets'
import { Bills } from '@/pages/Bills/Bills'
import { Savings } from '@/pages/Savings/Savings'
import { Profile } from '@/pages/Profile/Profile'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public: redirect to /dashboard if already logged in */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* Protected: require auth */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses"  element={<Expenses />} />
          <Route path="/budgets"   element={<Budgets />} />
          <Route path="/bills"     element={<Bills />} />
          <Route path="/savings"   element={<Savings />} />
          <Route path="/profile"   element={<Profile />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
