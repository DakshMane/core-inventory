import { formatDate } from '../../../utils/formatDate'
import Badge from '../../../components/ui/Badge'

export default function ActivityFeed({ activity = [] }) {
  if (!activity.length)
    return <p className="text-gray-400 text-sm text-center py-8">No recent activity</p>

  return (
    <div className="space-y-3">
      {activity.map((item, i) => {
        // Build a description dynamically from the StockMove document
        const isDelivery = item.type === 'delivery'
        const isReceipt = item.type === 'receipt'
        const action = isReceipt ? 'Received' : isDelivery ? 'Delivered' : 'Transferred'
        const desc = `${action} ${item.items?.length || 0} product(s) - ${item.reference}`

        return (
          <div key={item._id || i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-800">{desc}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.createdAt || item.date)}</p>
            </div>
            <Badge status={item.status} />
          </div>
        )
      })}
    </div>
  )
}