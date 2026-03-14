import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function UnitOfMeasureManager({ uoms = [], onCreate }) {
  const [name, setName] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim())
    setName('')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="e.g. kg, pcs, litre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm">Add</Button>
      </form>
      <div className="flex flex-wrap gap-2">
        {uoms.map((u) => (
          <span key={u.id} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            {u.name}
          </span>
        ))}
      </div>
    </div>
  )
}