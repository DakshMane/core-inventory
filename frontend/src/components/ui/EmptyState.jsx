export default function EmptyState({
  title   = 'No records found',
  message = 'Try adjusting your filters or create a new entry.',
  icon    = '📭',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-gray-700 font-semibold text-base mb-1">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs">{message}</p>
    </div>
  )
}