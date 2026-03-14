import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

export default function ProductForm({ initial = {}, categories = [], onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '', sku: '', category: '', uom: '', initialQty: 0, ...initial,
  })

  const uomOptions = [
    { value: 'pcs',   label: 'Pieces'   },
    { value: 'kg',    label: 'Kg'       },
    { value: 'litre', label: 'Litre'    },
    { value: 'box',   label: 'Box'      },
  ]

  const catOptions = categories.map((c) => ({ value: c.id, label: c.name }))

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Product Name" name="name"     value={form.name}     onChange={handleChange} required />
        <Input label="SKU / Code"   name="sku"      value={form.sku}      onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" name="category" value={form.category} onChange={handleChange} options={catOptions} />
        <Select label="Unit of Measure" name="uom" value={form.uom}  onChange={handleChange} options={uomOptions} />
      </div>
      <Input
        label="Initial Stock (optional)"
        type="number" name="initialQty"
        value={form.initialQty}
        onChange={handleChange}
        min={0}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>Save Product</Button>
      </div>
    </form>
  )
}