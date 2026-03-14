import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import { useState } from 'react'

export default function WarehouseList({ warehouses = [], onDelete }) {
  const [deleteId, setDeleteId] = useState(null)

  return (
    <>
      <ul className="divide-y divide-gray-100">
        {warehouses.map((w) => (
          <li key={w.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">{w.name}</p>
              <p className="text-xs text-gray-400">{w.address || 'No address'}</p>
            </div>
            <button
              onClick={() => setDeleteId(w.id)}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { onDelete(deleteId); setDeleteId(null) }}
        title="Remove Warehouse?"
        message="This will remove the warehouse and all its locations."
        confirmLabel="Remove"
        danger
      />
    </>
  )
}