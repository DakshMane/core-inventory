import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import LocationSelector from '../../transfers/components/LocationSelector'
import DiffBadge from './DiffBadge'

export default function AdjustmentForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    productName: '', location: '', expectedQty: '', countedQty: '', reason: '',
  })

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Product" name="productName" value={form.productName} onChange={handleChange} placeholder="Product name or SKU" required />
        <LocationSelector label="Location" name="location" value={form.location} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Recorded Qty" type="number" name="expectedQty" value={form.expectedQty} onChange={handleChange} min={0} required />
        <Input label="Counted Qty"  type="number" name="countedQty"  value={form.countedQty}  onChange={handleChange} min={0} required />
      </div>

      {form.expectedQty !== '' && form.countedQty !== '' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Difference:</span>
          <DiffBadge expected={Number(form.expectedQty)} counted={Number(form.countedQty)} />
        </div>
      )}

      <Input label="Reason (optional)" name="reason" value={form.reason} onChange={handleChange} placeholder="e.g. damaged, miscounted" />

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>Apply Adjustment</Button>
      </div>
    </form>
  )
}