import Select from '../ui/Select'

export default function FilterBar({ filters = [], values = {}, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <Select
          key={filter.key}
          options={filter.options}
          placeholder={filter.placeholder || `All ${filter.label}`}
          value={values[filter.key] || ''}
          onChange={(e) => onChange(filter.key, e.target.value)}
          className="w-40"
        />
      ))}
    </div>
  )
}