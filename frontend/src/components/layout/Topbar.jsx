import { useSelector, useDispatch } from 'react-redux'
import { useLocation, NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'
import { logout } from '../../features/auth/authSlice'
import { auth } from '../../config/firebase'
import { signOut } from 'firebase/auth'
import axiosInstance from '../../services/axiosInstance'

const pageTitles = {
  '/':            'Dashboard',
  '/products':    'Products',
  '/receipts':    'Receipts',
  '/deliveries':  'Delivery Orders',
  '/transfers':   'Internal Transfers',
  '/adjustments': 'Stock Adjustments',
  '/move-history':'Move History',
  '/settings':    'Settings',
  '/profile':     'My Profile',
}

const navLinks = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD },
  { label: 'Products',  path: ROUTES.PRODUCTS },
  { label: 'Operations',path: ROUTES.RECEIPTS },
  { label: 'Stock',     path: ROUTES.ADJUSTMENTS },
  { label: 'Move History', path: ROUTES.MOVE_HISTORY },
  { label: 'Settings',  path: ROUTES.SETTINGS }
]

export default function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const title = pageTitles[location.pathname] ?? 'Dashboard'

  async function handleLogout() {
    try {
      await axiosInstance.post('/user/logout')
      await signOut(auth)
    } finally {
      dispatch(logout())
      navigate(ROUTES.LOGIN)
    }
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      {/* Left: Navigation Links */}
      <nav className="flex items-center gap-6">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Right: Title & User Profile Block */}
      <div className="flex items-center gap-6">
        <h1 className="text-gray-900 font-semibold text-base">
          {title}
        </h1>
        
        <div className="relative group cursor-pointer flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <span className="text-gray-700 text-sm font-medium">{user?.name ?? 'User'}</span>
          
          {/* Dropdown Logout */}
          <div className="absolute right-0 top-10 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}