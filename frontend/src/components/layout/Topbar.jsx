import { useSelector, useDispatch } from 'react-redux'
import { useLocation, NavLink, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
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
  { label: 'Dashboard',  path: ROUTES.DASHBOARD },
  { label: 'Operations', path: ROUTES.RECEIPTS },
  { label: 'Stock',      path: ROUTES.PRODUCTS },
  { label: 'Move History', path: ROUTES.MOVE_HISTORY },
  { label: 'Settings',   path: ROUTES.SETTINGS }
]

export default function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const title = pageTitles[location.pathname] ?? 'Dashboard'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

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
        
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 text-xs font-semibold">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <span className="text-gray-700 text-sm font-medium">{user?.name ?? 'User'}</span>
            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-11 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800 truncate">{user?.name ?? 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email ?? ''}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setMenuOpen(false); navigate(ROUTES.PROFILE) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  My Profile
                </button>
                <div className="border-t border-gray-100 mx-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5"
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}