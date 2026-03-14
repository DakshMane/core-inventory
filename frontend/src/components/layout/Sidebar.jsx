import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ROUTES } from '../../routes/routes'
import { logout } from '../../features/auth/authSlice'
import { auth } from '../../config/firebase'
import { signOut } from 'firebase/auth'
import axiosInstance from '../../services/axiosInstance'

const nav = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: '▦' },
    ],
  },
  {
    section: 'Products',
    items: [
      { label: 'Products', path: ROUTES.PRODUCTS, icon: '⬡' },
    ],
  },
  {
    section: 'Operations',
    items: [
      { label: 'Receipts',   path: ROUTES.RECEIPTS,   icon: '↓' },
      { label: 'Deliveries', path: ROUTES.DELIVERIES, icon: '↑' },
      { label: 'Transfers',  path: ROUTES.TRANSFERS,  icon: '⇄' },
      { label: 'Adjustments',path: ROUTES.ADJUSTMENTS,icon: '⊡' },
      { label: 'Move History',path: ROUTES.MOVE_HISTORY,icon: '≡' },
    ],
  },
  {
    section: 'Config',
    items: [
      { label: 'Settings', path: ROUTES.SETTINGS, icon: '⚙' },
    ],
  },
]

export default function Sidebar() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  async function handleLogout() {
    try {
      // 1. Call backend to revoke refresh tokens
      await axiosInstance.post('/user/logout')
      // 2. Sign out from Firebase
      await signOut(auth)
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // 3. Clear local state and redirect
      dispatch(logout())
      navigate(ROUTES.LOGIN)
    }
  }

  return (
    <aside className="w-60 min-h-screen bg-gray-900 flex flex-col">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">CI</span>
          </div>
          <span className="text-white font-semibold text-sm">CoreInventory</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {nav.map((group) => (
          <div key={group.section}>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider px-2 mb-1">
              {group.section}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.DASHBOARD}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div className="px-3 py-4 border-t border-gray-700 space-y-1">
        <NavLink
          to={ROUTES.PROFILE}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          <span className="text-base">👤</span>
          My Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
        >
          <span className="text-base">⎋</span>
          Logout
        </button>
      </div>

    </aside>
  )
}