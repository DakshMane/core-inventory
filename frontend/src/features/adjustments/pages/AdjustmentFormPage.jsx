import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adjustmentsApi } from '../adjustmentsApi'
import AdjustmentForm from '../components/AdjustmentForm'
import { useToast } from '../../../hooks/useToast'

export default function AdjustmentFormPage() {
  const navigate = useNavigate()
  const toast    = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(form) {
    setLoading(true)
    try {
      await adjustmentsApi.create(form)
      toast.success('Adjustment applied — stock updated!')
      navigate('/adjustments')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">New Stock Adjustment</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AdjustmentForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}