import { useEffect, useState } from 'react'
import { productsApi } from '../productsApi'
import { formatQty } from '../../../utils/formatQty'
import Spinner from '../../../components/ui/Spinner'

export default function StockByLocation({ productId, uom }) {
  const [stock, setStock]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsApi.getStock(productId)
      .then((r) => setStock(r.data))
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) return <Spinner size="md" color="blue" />

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">Stock by Location</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-5 py-2 text-left text-xs text-gray-500">Warehouse</th>
            <th className="px-5 py-2 text-left text-xs text-gray-500">Location</th>
            <th className="px-5 py-2 text-left text-xs text-gray-500">Qty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stock.map((s, i) => (
            <tr key={i}>
              <td className="px-5 py-3 text-gray-700">{s.warehouse}</td>
              <td className="px-5 py-3 text-gray-700">{s.location}</td>
              <td className="px-5 py-3 font-medium text-gray-900">{formatQty(s.qty, uom)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}