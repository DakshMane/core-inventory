import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import ReceiptLineItem from './ReceiptLineItem'

const emptyLine = () => ({ productName: '', expectedQty: '', doneQty: '' })

export default function ReceiptForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    supplier: '', scheduledDate: '', lines: [emptyLine()], ...initial,
  })

  function handleField(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleLine(i, updated) {
    const lines = [...form.lines]
    lines[i] = updated
    setForm((p) => ({ ...p, lines }))
  }

  function addLine()    { setForm((p) => ({ ...p, lines: [...p.lines, emptyLine()] })) }
  function removeLine(i){ setForm((p) => ({ ...p, lines: p.lines.filter((_, idx) => idx !== i) })) }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Supplier" name="supplier" value={form.supplier} onChange={handleField} placeholder="Supplier name" required />
        <Input label="Scheduled Date" type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleField} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Products</p>
          <button type="button" onClick={addLine} className="text-sm text-blue-600 hover:underline">+ Add line</button>
        </div>
        {form.lines.map((line, i) => (
          <ReceiptLineItem key={i} line={line} index={i} onChange={handleLine} onRemove={removeLine} />
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={loading}>Save Receipt</Button>
      </div>
    </form>
  )
}