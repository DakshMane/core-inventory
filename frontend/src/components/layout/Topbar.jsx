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
  { label: 'Dashboard',    path: ROUTES.DASHBOARD },
  {
    label: 'Operations',
    path: ROUTES.RECEIPTS,
    submenu: [
      { label: 'Receipt',     path: ROUTES.RECEIPTS },
      { label: 'Delivery',    path: ROUTES.DELIVERIES },
      { label: 'Adjustment',  path: ROUTES.ADJUSTMENTS },
    ],
  },
  { label: 'Stock',        path: ROUTES.PRODUCTS },
  { label: 'Move History', path: ROUTES.MOVE_HISTORY },
  { label: 'Settings',     path: ROUTES.SETTINGS },
]

export default function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [menuOpen, setMenuOpen]           = useState(false)   // user dropdown
  const [mobileOpen, setMobileOpen]       = useState(false)   // hamburger
  const [opsSubmenuOpen, setOpsSubmenuOpen] = useState(false) // desktop ops submenu
  const [mobileOpsOpen, setMobileOpsOpen]  = useState(false)  // mobile ops submenu

  const menuRef    = useRef(null)
  const opsRef     = useRef(null)
  const mobileRef  = useRef(null)

  const title = pageTitles[location.pathname] ?? 'Dashboard'

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (opsRef.current  && !opsRef.current.contains(e.target))  setOpsSubmenuOpen(false)
      if (
        mobileRef.current &&
        !mobileRef.current.contains(e.target) &&
        !e.target.closest('[data-hamburger]')
      ) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close all menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setMobileOpen(false)
    setOpsSubmenuOpen(false)
    setMobileOpsOpen(false)
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

  // Check if any submenu route is active
  const isOpsActive = navLinks
    .find((l) => l.label === 'Operations')
    ?.submenu?.some((s) => location.pathname.startsWith(s.path))

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 relative z-40">

      {/* ── Left: Desktop Nav ── */}
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((link) =>
          link.submenu ? (
            // Operations with submenu
            <div key={link.path} ref={opsRef} className="relative">
              <button
                onClick={() => setOpsSubmenuOpen((p) => !p)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isOpsActive || opsSubmenuOpen
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${opsSubmenuOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {opsSubmenuOpen && (
                <div className="absolute left-0 top-9 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {link.submenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === ROUTES.DASHBOARD}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          )
        )}
      </nav>

      {/* ── Left: Hamburger (mobile) ── */}
      <button
        data-hamburger
        onClick={() => setMobileOpen((p) => !p)}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <span className={`block h-0.5 w-5 bg-gray-700 transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block h-0.5 w-5 bg-gray-700 transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-5 bg-gray-700 transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* ── Right: Title & User ── */}
      <div className="flex items-center gap-4 md:gap-6">
        <h1 className="text-gray-900 font-semibold text-base hidden sm:block">{title}</h1>

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
            <span className="text-gray-700 text-sm font-medium hidden sm:block">{user?.name ?? 'User'}</span>
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

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

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div
          ref={mobileRef}
          className="absolute top-14 left-0 w-full bg-white border-b border-gray-200 shadow-lg md:hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <nav className="flex flex-col py-2">
            {navLinks.map((link) =>
              link.submenu ? (
                <div key={link.path}>
                  <button
                    onClick={() => setMobileOpsOpen((p) => !p)}
                    className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${
                      isOpsActive ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${mobileOpsOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {mobileOpsOpen && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      {link.submenu.map((sub) => (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          className={({ isActive }) =>
                            `block pl-10 pr-5 py-2.5 text-sm transition-colors ${
                              isActive
                                ? 'text-blue-600 font-medium bg-blue-50'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === ROUTES.DASHBOARD}
                  className={({ isActive }) =>
                    `px-5 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  )
}