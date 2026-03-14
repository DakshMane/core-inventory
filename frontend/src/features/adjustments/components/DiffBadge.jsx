export default function DiffBadge({ expected, counted }) {
  const diff = counted - expected
  if (diff === 0) return <span className="text-sm text-gray-400">No change</span>

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold
      ${diff > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {diff > 0 ? `+${diff}` : diff}
    </span>
  )
}