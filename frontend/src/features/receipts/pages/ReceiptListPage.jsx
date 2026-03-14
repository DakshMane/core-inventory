import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { receiptsApi } from '../receiptsApi'
import ReceiptList from '../components/ReceiptList'
import FilterBar from '../../../components/forms/FilterBar'
import Button from '../../../components/ui/Button'
import { STATUS_OPTIONS } from '../../../constants/statusTypes'

export default function ReceiptListPage() {
  const navigate = useNavigate()
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filters, setFilters]   = useState({ status: '' })

  useEffect(() => {
    receiptsApi.getAll(filters)
      .then((r) => setReceipts(r.data.data || []))
      .finally(() => setLoading(false))
  }, [filters])

  const filterConfig = [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Receipts</h2>
        <Button onClick={() => navigate('/receipts/new')}>+ New Receipt</Button>
      </div>
      <FilterBar filters={filterConfig} values={filters} onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))} />
      <ReceiptList data={receipts} loading={loading} />
    </div>
  )
}