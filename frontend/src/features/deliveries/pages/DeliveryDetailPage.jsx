import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { deliveriesApi } from '../deliveriesApi'
import DeliveryDetail from '../components/DeliveryDetail'
import Spinner from '../../../components/ui/Spinner'

export default function DeliveryDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [delivery, setDelivery] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    deliveriesApi.getOne(id)
      .then((r) => setDelivery(r.data.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="blue" /></div>

  return (
    <div className="max-w-3xl space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
      <DeliveryDetail delivery={delivery} onValidated={setDelivery} />
    </div>
  )
}