import { useEffect, useState } from 'react'
import { moveHistoryApi } from '../moveHistoryApi'
import MoveHistoryTable from '../components/MoveHistoryTable'
import MoveHistoryFilters from '../components/MoveHistoryFilters'
import SearchInput from '../../../components/forms/SearchInput'

export default function MoveHistoryPage() {
  const [moves, setMoves]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ type: '', from: '', to: '' })
  const [search, setSearch]   = useState('')

  useEffect(() => {
    setLoading(true)
    moveHistoryApi.getAll({ ...filters, search })
      .then((r) => setMoves(r.data.data || []))
      .finally(() => setLoading(false))
  }, [filters, search])

  function handleFilter(key, val) {
    setFilters((p) => ({ ...p, [key]: val }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Move History</h2>
      <div className="flex flex-wrap gap-3 items-center">
        <SearchInput onSearch={setSearch} placeholder="Search product..." className="w-60" />
        <MoveHistoryFilters filters={filters} onChange={handleFilter} />
      </div>
      <MoveHistoryTable data={moves} loading={loading} />
    </div>
  )
}