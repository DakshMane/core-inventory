import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { transfersApi } from '../transfersApi'
import TransferList from '../components/TransferList'
import FilterBar from '../../../components/forms/FilterBar'
import Button from '../../../components/ui/Button'
import { STATUS_OPTIONS } from '../../../constants/statusTypes'

export default function TransferListPage() {
  const navigate = useNavigate()
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filters, setFilters]     = useState({ status: '' })

  useEffect(() => {
    transfersApi.getAll(filters)
      .then((r) => setTransfers(r.data))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Internal Transfers</h2>
        <Button onClick={() => navigate('/transfers/new')}>+ New Transfer</Button>
      </div>
      <FilterBar
        filters={[{ key: 'status', label: 'Status', options: STATUS_OPTIONS }]}
        values={filters}
        onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
      />
      <TransferList data={transfers} loading={loading} />
    </div>
  )
}