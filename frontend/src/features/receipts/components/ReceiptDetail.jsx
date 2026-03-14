import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/formatDate'
import { formatQty } from '../../../utils/formatQty'
import ValidateReceiptButton from './ValidateReceiptButton'

export default function ReceiptDetail({ receipt, onValidated }) {
  if (!receipt) return null

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400">Receipt</p>
            <h2 className="text-lg font-semibold text-gray-900">{receipt.ref || `#${receipt.id}`}</h2>
          </div>
          <Badge status={receipt.status} />
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-gray-400 text-xs">Supplier</dt><dd className="text-gray-800 mt-0.5">{receipt.supplier}</dd></div>
          <div><dt className="text-gray-400 text-xs">Scheduled</dt><dd className="text-gray-800 mt-0.5">{formatDate(receipt.scheduledDate)}</dd></div>
        </dl>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs text-gray-500">Product</th>
              <th className="px-5 py-3 text-left text-xs text-gray-500">Expected</th>
              <th className="px-5 py-3 text-left text-xs text-gray-500">Done</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {receipt.lines?.map((l, i) => (
              <tr key={i}>
                <td className="px-5 py-3 text-gray-800">{l.productName}</td>
                <td className="px-5 py-3 text-gray-600">{formatQty(l.expectedQty)}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{formatQty(l.doneQty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <ValidateReceiptButton
          receiptId={receipt.id}
          status={receipt.status}
          onValidated={onValidated}
        />
      </div>
    </div>
  )
}