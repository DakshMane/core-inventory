import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function CategoryManager({ categories = [], onCreate, onDelete }) {
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
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm">Add</Button>
      </form>
      <ul className="divide-y divide-gray-100">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">{c.name}</span>
            <button
              onClick={() => onDelete(c.id)}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}