import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import ReceiptLineItem from './ReceiptLineItem'

const emptyLine = () => ({ productName: '', expectedQty: '', doneQty: '' })

export default function ReceiptForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    supplier: '', scheduledDate: '', notes: '', lines: [emptyLine()], ...initial,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Action Header */}
      <div className="flex items-center gap-3 bg-white p-4 border-b border-gray-200">
        <Button type="submit" loading={loading} className="px-6 relative shadow-sm">
          Save Receipt
        </Button>
        <button type="button" className="text-gray-600 border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2">
          <span>🖨️</span> Print
        </button>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mx-4">
        {/* Title */}
        <div className="mb-6 pb-4 border-b border-gray-100/50">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Draft Receipt</h2>
        </div>

        {/* Top 2-Column Info */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-8">
          <div className="space-y-4">
            <Input label="Receive From" name="supplier" value={form.supplier} onChange={handleField} placeholder="e.g. Vendor A" required />
            <Input label="Destination Location" value="WH/Stock" disabled />
          </div>
          <div className="space-y-4">
            <Input label="Scheduled Date" type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleField} min={new Date().toISOString().split('T')[0]} />
            <Input label="Source Document" placeholder="e.g. PO0001" disabled />
          </div>
        </div>

        {/* Nested Tabs Section */}
        <div>
          <div className="flex border-b border-gray-200 mb-4">
            <button type="button" className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 -mb-px">
              Operations
            </button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
              Additional Info
            </button>
          </div>
          
          <div className="px-1">
             {/* Operations Table Headers */}
             <div className="grid grid-cols-12 gap-4 pb-2 mb-2 border-b border-gray-200">
                <div className="col-span-5 text-sm font-semibold text-gray-600">Product</div>
                <div className="col-span-3 text-sm font-semibold text-gray-600">Demand</div>
                <div className="col-span-3 text-sm font-semibold text-gray-600">Done</div>
                <div className="col-span-1 border-gray-50 bg-gray-50" />
             </div>
             
             {/* Rows */}
             {form.lines.map((line, i) => (
               <ReceiptLineItem key={i} line={line} index={i} onChange={handleLine} onRemove={removeLine} />
             ))}
             
             {/* Add Line Action */}
             <div className="mt-3">
                <button type="button" onClick={addLine} className="text-sm text-blue-600 font-medium hover:text-blue-700">
                  + Add a line
                </button>
             </div>
          </div>
        </div>
      </div>
    </form>
  )
}