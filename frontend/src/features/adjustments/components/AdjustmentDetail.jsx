import { formatDate } from '../../../utils/formatDate'
import DiffBadge from './DiffBadge'

export default function AdjustmentDetail({ adjustment }) {
  if (!adjustment) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Adjustment Detail</h2>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div><dt className="text-xs text-gray-400">Product</dt><dd className="text-gray-800 mt-0.5">{adjustment.productName}</dd></div>
        <div><dt className="text-xs text-gray-400">Location</dt><dd className="text-gray-800 mt-0.5">{adjustment.location}</dd></div>
        <div><dt className="text-xs text-gray-400">Recorded</dt><dd className="text-gray-800 mt-0.5">{adjustment.expectedQty}</dd></div>
        <div><dt className="text-xs text-gray-400">Counted</dt><dd className="text-gray-800 mt-0.5">{adjustment.countedQty}</dd></div>
        <div><dt className="text-xs text-gray-400">Difference</dt><dd className="mt-0.5"><DiffBadge expected={adjustment.expectedQty} counted={adjustment.countedQty} /></dd></div>
        <div><dt className="text-xs text-gray-400">Date</dt><dd className="text-gray-800 mt-0.5">{formatDate(adjustment.createdAt)}</dd></div>
        {adjustment.reason && (
          <div className="col-span-2"><dt className="text-xs text-gray-400">Reason</dt><dd className="text-gray-800 mt-0.5">{adjustment.reason}</dd></div>
        )}
      </dl>
    </div>
  )
}