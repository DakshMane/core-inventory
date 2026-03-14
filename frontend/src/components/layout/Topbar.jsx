import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

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

export default function Topbar() {
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

  const title = pageTitles[location.pathname] ?? 'CoreInventory'

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-gray-900 font-semibold text-base">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 text-lg relative">
          🔔
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <span className="text-gray-700 text-sm font-medium">{user?.name ?? 'User'}</span>
        </div>
      </div>
    </header>
  )
}