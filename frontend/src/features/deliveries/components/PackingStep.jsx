export default function PackingStep({ lines = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">2</span>
        <h3 className="text-sm font-semibold text-gray-800">Pack Items</h3>
      </div>
      <p className="text-xs text-gray-400">Confirm quantities packed for dispatch.</p>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Product</th>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Demand</th>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Packed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {lines.map((l, i) => (
            <tr key={i}>
              <td className="px-4 py-3 text-gray-800">{l.productName}</td>
              <td className="px-4 py-3 text-gray-500">{l.demandQty}</td>
              <td className="px-4 py-3 font-medium text-green-700">{l.doneQty || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}