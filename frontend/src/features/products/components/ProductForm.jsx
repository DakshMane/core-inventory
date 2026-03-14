import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

export default function ProductForm({ initial = {}, categories = [], locations = [], isEdit, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '', sku: '', category: '', uom: '', costPrice: 0, salePrice: 0, initialQty: 0, location: '', reorderLevel: 0, ...initial,
  })

  const uomOptions = [
    { value: 'pcs',   label: 'Pieces'   },
    { value: 'kg',    label: 'Kg'       },
    { value: 'litre', label: 'Litre'    },
    { value: 'box',   label: 'Box'      },
  ]

  const catOptions = categories.map((c) => ({ value: c._id || c.id, label: c.name }))

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

      <div className="grid grid-cols-2 gap-4">
        <Input label="Cost Price (₹)" type="number" name="costPrice" value={form.costPrice} onChange={handleChange} min={0} step="0.01" />
        <Input label="Sale Price (₹)" type="number" name="salePrice" value={form.salePrice} onChange={handleChange} min={0} step="0.01" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Reorder Level" 
          type="number" name="reorderLevel" 
          value={form.reorderLevel} 
          onChange={handleChange} 
          min={0} 
        />
        <div /> {/* spacing */}
      </div>

      {!isEdit && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-2">
          <Input
            label="Initial Stock (optional)"
            type="number" name="initialQty"
            value={form.initialQty}
            onChange={handleChange}
            min={0}
            className="bg-green-50/30"
          />
          <Select 
            label="Location for Initial Stock" 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            options={locations.map(l => ({ value: String(l._id || l.id), label: `${l.name} (${l.type})`}))} 
            disabled={!form.initialQty || form.initialQty <= 0}
            required={form.initialQty > 0}
          />
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>Save Product</Button>
      </div>
    </form>
  )
}