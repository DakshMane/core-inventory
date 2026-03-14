const variants = {
  draft:     'bg-gray-100 text-gray-600',
  waiting:   'bg-yellow-100 text-yellow-700',
  ready:     'bg-blue-100 text-blue-700',
  done:      'bg-green-100 text-green-700',
  canceled:  'bg-red-100 text-red-600',
  low:       'bg-orange-100 text-orange-700',
  in_stock:  'bg-emerald-100 text-emerald-700',
  out:       'bg-red-100 text-red-600',
}

export default function Badge({ status, label, className = '' }) {
  const key = status?.toLowerCase()
  const style = variants[key] || 'bg-gray-100 text-gray-600'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${style} ${className}`}>
      {label || status}
    </span>
  )
}