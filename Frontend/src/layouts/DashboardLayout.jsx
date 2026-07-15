import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, Receipt, PieChart, CreditCard,
  PiggyBank, TrendingUp, LogOut, ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses',  icon: Receipt,         label: 'Transactions' },
  { to: '/budgets',   icon: PieChart,        label: 'Budgets' },
  { to: '/bills',     icon: CreditCard,      label: 'Bills' },
  { to: '/savings',   icon: PiggyBank,       label: 'Savings' },
]

function Sidebar({ mobile = false, collapsed = false, onClose, onLogout, user }) {
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '?'
  const narrow = collapsed && !mobile

  return (
    <div className={`flex flex-col h-full ${mobile ? 'w-64' : collapsed ? 'w-16' : 'w-60'} transition-all duration-300`}>
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${narrow ? 'justify-center px-2' : ''}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        {!narrow && <span className="text-base font-bold text-white font-display tracking-tight">FinFlow</span>}
      </div>

      {/* Nav links */}
      <nav className={`flex-1 py-4 space-y-0.5 ${narrow ? 'px-1' : 'px-2'}`}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => mobile && onClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all border
              ${isActive ? 'bg-blue-500/15 text-white border-blue-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'}
              ${narrow ? 'justify-center px-2' : ''}`
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {!narrow && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div className="border-t border-white/5 p-2 space-y-1">
        <NavLink
          to="/profile"
          onClick={() => mobile && onClose?.()}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all border
            ${isActive ? 'bg-blue-500/15 text-white border-blue-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'}
            ${narrow ? 'justify-center px-2' : ''}`
          }
        >
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
            {initials}
          </div>
          {!narrow && <span className="truncate">{user?.firstName}</span>}
        </NavLink>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all ${narrow ? 'justify-center px-2' : ''}`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!narrow && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop only) */}
      {!mobile && (
        <button
          onClick={() => {}}
          className="p-2 mx-2 mb-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}
    </div>
  )
}

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '?'

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col glass border-r border-white/5 shrink-0 sticky top-0 h-screen overflow-hidden transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? 'justify-center px-2' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="text-base font-bold text-white font-display tracking-tight">FinFlow</span>}
        </div>

        <nav className={`flex-1 py-4 space-y-0.5 ${collapsed ? 'px-1' : 'px-2'}`}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all border
                ${isActive ? 'bg-blue-500/15 text-white border-blue-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'}
                ${collapsed ? 'justify-center px-2' : ''}`
              }
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/5 p-2 space-y-1">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all border
              ${isActive ? 'bg-blue-500/15 text-white border-blue-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'}
              ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
              {initials}
            </div>
            {!collapsed && <span className="truncate">{user?.firstName}</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 mx-2 mb-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden glass border-r border-white/5 w-64"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold text-white font-display tracking-tight">FinFlow</span>
              </div>

              <nav className="flex-1 py-4 space-y-0.5 px-2">
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all border
                      ${isActive ? 'bg-blue-500/15 text-white border-blue-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'}`
                    }
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="border-t border-white/5 p-2 space-y-1">
                <NavLink
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all border
                    ${isActive ? 'bg-blue-500/15 text-white border-blue-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'}`
                  }
                >
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                    {initials}
                  </div>
                  <span className="truncate">{user?.firstName}</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                >
                  <LogOut className="w-[18px] h-[18px] shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3.5 glass border-b border-white/5 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm font-display">FinFlow</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
