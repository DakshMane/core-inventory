import { useState } from 'react'

export default function LocationForm({ warehouses = [], onSubmit, loading }) {
  const [form, setForm] = useState({ warehouseId: '', name: '' })
  const [focused, setFocused] = useState(null)

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const warehouseOptions = warehouses.map((w) => ({ value: w.id, label: w.name }))

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}
      className="relative"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

        {/* Warehouse Select */}
        <div className="relative group">
          <label
            className={`absolute left-3.5 transition-all duration-200 pointer-events-none font-medium z-10 ${
              focused === 'warehouseId' || form.warehouseId
                ? 'top-2 text-[10px] text-blue-500 tracking-widest uppercase'
                : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
            }`}
          >
            Warehouse
          </label>
          <select
            name="warehouseId"
            value={form.warehouseId}
            onChange={handleChange}
            onFocus={() => setFocused('warehouseId')}
            onBlur={() => setFocused(null)}
            required
            className={`w-full pt-6 pb-2.5 px-3.5 rounded-xl border bg-gray-50/60 text-sm text-gray-800 outline-none transition-all duration-200 appearance-none cursor-pointer
              ${focused === 'warehouseId'
                ? 'border-blue-400 bg-white shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <option value="" disabled />
            {warehouseOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {/* Custom chevron */}
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Location Name */}
        <div className="relative group">
          <label
            className={`absolute left-3.5 transition-all duration-200 pointer-events-none font-medium z-10 ${
              focused === 'name' || form.name
                ? 'top-2 text-[10px] text-blue-500 tracking-widest uppercase'
                : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
            }`}
          >
            Location Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            required
            placeholder={focused === 'name' ? 'e.g. Rack A' : ''}
            className={`w-full pt-6 pb-2.5 px-3.5 rounded-xl border bg-gray-50/60 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-300
              ${focused === 'name'
                ? 'border-blue-400 bg-white shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !form.warehouseId || !form.name.trim()}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
            transition-all duration-200 select-none
            ${loading || !form.warehouseId || !form.name.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97] shadow-sm hover:shadow-md'
            }
          `}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              Adding…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Location
            </>
          )}
        </button>
      </div>
    </form>
  )
}