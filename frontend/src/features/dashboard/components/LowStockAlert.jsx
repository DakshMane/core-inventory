import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../routes/routes'

export default function LowStockAlert({ count = 0 }) {
  const navigate = useNavigate()
  if (!count) return null
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-orange-500 text-lg">⚠</span>
        <p className="text-orange-800 text-sm font-medium">
          {count} product{count > 1 ? 's' : ''} low or out of stock
        </p>
      </div>
      <button
        onClick={() => navigate(ROUTES.PRODUCTS)}
        className="text-orange-600 text-sm font-medium hover:underline"
      >
        View →
      </button>
    </div>
  )
}