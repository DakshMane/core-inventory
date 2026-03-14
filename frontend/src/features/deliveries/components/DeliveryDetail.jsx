import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/formatDate'
import PickingStep from './PickingStep'
import PackingStep from './PackingStep'
import ValidateDeliveryButton from './ValidateDeliveryButton'

export default function DeliveryDetail({ delivery, onValidated }) {
  if (!delivery) return null

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400">Delivery Order</p>
            <h2 className="text-lg font-semibold text-gray-900">{delivery.ref || `#${delivery.id}`}</h2>
          </div>
          <Badge status={delivery.status} />
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-gray-400 text-xs">Customer</dt><dd className="text-gray-800 mt-0.5">{delivery.customer}</dd></div>
          <div><dt className="text-gray-400 text-xs">Scheduled</dt><dd className="text-gray-800 mt-0.5">{formatDate(delivery.scheduledDate)}</dd></div>
        </dl>
      </div>

      <PickingStep lines={delivery.lines} />
      <PackingStep lines={delivery.lines} />

      <div className="flex justify-end">
        <ValidateDeliveryButton
          deliveryId={delivery.id}
          status={delivery.status}
          onValidated={onValidated}
        />
      </div>
    </div>
  )
}