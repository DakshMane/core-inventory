import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

export default function LocationForm({ warehouses = [], onSubmit, loading }) {
  const [form, setForm] = useState({ warehouseId: '', name: '' })

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const warehouseOptions = warehouses.map((w) => ({ value: w.id, label: w.name }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Select label="Warehouse" name="warehouseId" value={form.warehouseId} onChange={handleChange} options={warehouseOptions} required />
        <Input  label="Location Name" name="name"    value={form.name}        onChange={handleChange} placeholder="e.g. Rack A" required />
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={loading}>Add Location</Button>
      </div>
    </form>
  )
}