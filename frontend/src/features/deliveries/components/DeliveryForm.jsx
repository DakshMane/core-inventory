import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import DeliveryLineItem from './DeliveryLineItem'

const emptyLine = () => ({ productName: '', demandQty: '', doneQty: '' })

export default function DeliveryForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    customer: '', scheduledDate: '', lines: [emptyLine()], ...initial,
  })

  function handleField(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleLine(i, updated) {
    const lines = [...form.lines]
    lines[i] = updated
    setForm((p) => ({ ...p, lines }))
  }

  function addLine()     { setForm((p) => ({ ...p, lines: [...p.lines, emptyLine()] })) }
  function removeLine(i) { setForm((p) => ({ ...p, lines: p.lines.filter((_, idx) => idx !== i) })) }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Customer"       name="customer"      value={form.customer}      onChange={handleField} placeholder="Customer name" required />
        <Input label="Scheduled Date" type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleField} min={new Date().toISOString().split('T')[0]} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Products</p>
          <button type="button" onClick={addLine} className="text-sm text-blue-600 hover:underline">+ Add line</button>
        </div>
        {form.lines.map((line, i) => (
          <DeliveryLineItem key={i} line={line} index={i} onChange={handleLine} onRemove={removeLine} />
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>Save Delivery</Button>
      </div>
    </form>
  )
}