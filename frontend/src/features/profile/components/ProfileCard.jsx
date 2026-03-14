import { useSelector } from 'react-redux'

export default function ProfileCard() {
  const { user } = useSelector((s) => s.auth)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-5">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
        {user?.name?.[0]?.toUpperCase() ?? 'U'}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
        <p className="text-gray-400 text-sm">{user?.email}</p>
        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
          {user?.role || 'Inventory Manager'}
        </span>
      </div>
    </div>
  )
}