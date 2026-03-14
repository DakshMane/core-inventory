export default function Spinner({ size = 'md', color = 'gray' }) {
  const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-7 h-7' }
  const colors = {
    gray:  'border-gray-300 border-t-gray-600',
    white: 'border-white/30 border-t-white',
    blue:  'border-blue-200 border-t-blue-600',
  }

  return (
    <div
      className={`${sizes[size]} ${colors[color]} border-2 rounded-full animate-spin`}
    />
  )
}