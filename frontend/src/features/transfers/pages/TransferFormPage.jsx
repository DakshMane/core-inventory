import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { transfersApi } from '../transfersApi'
import TransferForm from '../components/TransferForm'
import { useToast } from '../../../hooks/useToast'

export default function TransferFormPage() {
  const navigate = useNavigate()
  const toast    = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(form) {
    setLoading(true)
    try {
      await transfersApi.create(form)
      toast.success('Transfer created!')
      navigate('/transfers')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">New Internal Transfer</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <TransferForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}