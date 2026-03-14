export default function PickingStep({ lines = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1</span>
        <h3 className="text-sm font-semibold text-gray-800">Pick Items</h3>
      </div>
      <p className="text-xs text-gray-400">Collect the following items from the warehouse.</p>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Product</th>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Location</th>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Qty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {lines.map((l, i) => (
            <tr key={i}>
              <td className="px-4 py-3 text-gray-800">{l.productName}</td>
              <td className="px-4 py-3 text-gray-500">{l.location || '—'}</td>
              <td className="px-4 py-3 font-medium">{l.demandQty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}