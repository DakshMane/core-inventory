import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/formatDate'
import ValidateTransferButton from './ValidateTransferButton'

export default function TransferDetail({ transfer, onValidated }) {
  if (!transfer) return null

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400">Internal Transfer</p>
            <h2 className="text-lg font-semibold text-gray-900">{transfer.ref || `#${transfer.id}`}</h2>
          </div>
          <Badge status={transfer.status} />
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-gray-400 text-xs">From</dt><dd className="text-gray-800 mt-0.5">{transfer.fromLocation}</dd></div>
          <div><dt className="text-gray-400 text-xs">To</dt><dd className="text-gray-800 mt-0.5">{transfer.toLocation}</dd></div>
          <div><dt className="text-gray-400 text-xs">Scheduled</dt><dd className="text-gray-800 mt-0.5">{formatDate(transfer.scheduledDate)}</dd></div>
        </dl>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs text-gray-500">Product</th>
              <th className="px-5 py-3 text-left text-xs text-gray-500">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transfer.lines?.map((l, i) => (
              <tr key={i}>
                <td className="px-5 py-3 text-gray-800">{l.productName}</td>
                <td className="px-5 py-3 font-medium">{l.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <ValidateTransferButton transferId={transfer.id} status={transfer.status} onValidated={onValidated} />
      </div>
    </div>
  )
}