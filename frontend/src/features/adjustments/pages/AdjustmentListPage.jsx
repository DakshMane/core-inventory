import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adjustmentsApi } from '../adjustmentsApi'
import AdjustmentList from '../components/AdjustmentList'
import Button from '../../../components/ui/Button'

export default function AdjustmentListPage() {
  const navigate = useNavigate()
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    adjustmentsApi.getAll()
      .then((r) => setAdjustments(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Stock Adjustments</h2>
        <Button onClick={() => navigate('/adjustments/new')}>+ New Adjustment</Button>
      </div>
      <AdjustmentList data={adjustments} loading={loading} />
    </div>
  )
}