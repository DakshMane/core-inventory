import { STATUS_OPTIONS } from '../../../constants/statusTypes'
import Select from '../../../components/ui/Select'

const DOC_OPTIONS = [
  { value: 'receipt',    label: 'Receipts'    },
  { value: 'delivery',   label: 'Deliveries'  },
  { value: 'transfer',   label: 'Transfers'   },
  { value: 'adjustment', label: 'Adjustments' },
]

export default function DashboardFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select options={DOC_OPTIONS}   placeholder="All Types"      value={filters.type}      onChange={(e) => onChange('type', e.target.value)}      className="w-36" />
      <Select options={STATUS_OPTIONS} placeholder="All Statuses"  value={filters.status}    onChange={(e) => onChange('status', e.target.value)}    className="w-36" />
    </div>
  )
}