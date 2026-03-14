import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function WarehouseForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: '', address: '' })

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Warehouse Name" name="name"    value={form.name}    onChange={handleChange} placeholder="e.g. Main Warehouse" required />
        <Input label="Address"        name="address" value={form.address} onChange={handleChange} placeholder="Optional" />
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={loading}>Add Warehouse</Button>
      </div>
    </form>
  )
}