import { useState, useEffect } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

export default function SearchInput({ onSearch, placeholder = 'Search...', className = '' }) {
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 400)

  useEffect(() => {
    onSearch(debounced)
  }, [debounced])

  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
      />
    </div>
  )
}