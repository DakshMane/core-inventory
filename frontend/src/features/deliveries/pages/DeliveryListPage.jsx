import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deliveriesApi } from '../deliveriesApi'
import DeliveryList from '../components/DeliveryList'
import FilterBar from '../../../components/forms/FilterBar'
import Button from '../../../components/ui/Button'
import { STATUS_OPTIONS } from '../../../constants/statusTypes'

export default function DeliveryListPage() {
  const navigate = useNavigate()
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filters, setFilters]       = useState({ status: '' })

  useEffect(() => {
    deliveriesApi.getAll(filters)
      .then((r) => setDeliveries(r.data))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Delivery Orders</h2>
        <Button onClick={() => navigate('/deliveries/new')}>+ New Delivery</Button>
      </div>
      <FilterBar
        filters={[{ key: 'status', label: 'Status', options: STATUS_OPTIONS }]}
        values={filters}
        onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
      />
      <DeliveryList data={deliveries} loading={loading} />
    </div>
  )
}