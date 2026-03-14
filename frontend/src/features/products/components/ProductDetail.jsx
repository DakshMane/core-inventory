import { formatQty } from '../../../utils/formatQty'
import { formatDate } from '../../../utils/formatDate'
import Badge from '../../../components/ui/Badge'

export default function ProductDetail({ product }) {
  if (!product) return null

  const rows = [
    { label: 'SKU',       value: product.sku },
    { label: 'Category',  value: product.category?.name || product.category },
    { label: 'Unit',      value: product.uom },
    { label: 'In Stock',  value: formatQty(product.qty, product.uom) },
    { label: 'Status',    value: <Badge status={product.status} /> },
    { label: 'Created',   value: formatDate(product.createdAt) },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
      <dl className="grid grid-cols-2 gap-4">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs text-gray-400 font-medium">{r.label}</dt>
            <dd className="text-sm text-gray-800 mt-0.5">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}