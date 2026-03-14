import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function ReorderRuleForm({ productId, onSave }) {
  const [form, setForm] = useState({ minQty: '', reorderQty: '' })

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ productId, ...form })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">
        Alert when stock falls below minimum quantity.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Min Qty (alert threshold)"
          type="number" name="minQty"
          value={form.minQty}
          onChange={handleChange}
          min={0} required
        />
        <Input
          label="Reorder Qty"
          type="number" name="reorderQty"
          value={form.reorderQty}
          onChange={handleChange}
          min={0} required
        />
      </div>
      <Button type="submit" size="sm">Save Rule</Button>
    </form>
  )
}