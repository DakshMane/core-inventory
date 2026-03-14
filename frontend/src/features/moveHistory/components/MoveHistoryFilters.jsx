import Select from '../../../components/ui/Select'
import { OPERATION_TYPES } from '../../../constants/operationTypes'

const TYPE_OPTIONS = Object.values(OPERATION_TYPES).map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))

export default function MoveHistoryFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        options={TYPE_OPTIONS}
        placeholder="All Types"
        value={filters.type}
        onChange={(e) => onChange('type', e.target.value)}
        className="w-36"
      />
      <input
        type="date"
        value={filters.from}
        onChange={(e) => onChange('from', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      <input
        type="date"
        value={filters.to}
        onChange={(e) => onChange('to', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}