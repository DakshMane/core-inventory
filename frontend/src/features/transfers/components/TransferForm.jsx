import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import LocationSelector from './LocationSelector'

const emptyLine = () => ({ productName: '', qty: '' })

export default function TransferForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    fromLocation: '', toLocation: '', scheduledDate: '', lines: [emptyLine()], ...initial,
  })

  function handleField(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleLine(i, e) {
    const lines = [...form.lines]
    lines[i] = { ...lines[i], [e.target.name]: e.target.value }
    setForm((p) => ({ ...p, lines }))
  }

  function addLine()     { setForm((p) => ({ ...p, lines: [...p.lines, emptyLine()] })) }
  function removeLine(i) { setForm((p) => ({ ...p, lines: p.lines.filter((_, idx) => idx !== i) })) }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <LocationSelector label="From Location" name="fromLocation" value={form.fromLocation} onChange={handleField} />
        <LocationSelector label="To Location"   name="toLocation"   value={form.toLocation}   onChange={handleField} />
      </div>
      <Input label="Scheduled Date" type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleField} />

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Products</p>
          <button type="button" onClick={addLine} className="text-sm text-blue-600 hover:underline">+ Add line</button>
        </div>
        {form.lines.map((line, i) => (
          <div key={i} className="grid grid-cols-12 gap-3 items-end py-3 border-b border-gray-100 last:border-0">
            <div className="col-span-8">
              <Input label={i === 0 ? 'Product' : ''} name="productName" value={line.productName} onChange={(e) => handleLine(i, e)} placeholder="Product name or SKU" required />
            </div>
            <div className="col-span-3">
              <Input label={i === 0 ? 'Qty' : ''} type="number" name="qty" value={line.qty} onChange={(e) => handleLine(i, e)} min={1} required />
            </div>
            <div className="col-span-1 flex justify-end">
              <button onClick={() => removeLine(i)} className="text-red-400 hover:text-red-600 text-lg pb-1">✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>Save Transfer</Button>
      </div>
    </form>
  )
}