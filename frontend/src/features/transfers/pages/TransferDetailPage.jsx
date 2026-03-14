import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { transfersApi } from '../transfersApi'
import TransferDetail from '../components/TransferDetail'
import Spinner from '../../../components/ui/Spinner'

export default function TransferDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [transfer, setTransfer] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    transfersApi.getOne(id)
      .then((r) => setTransfer(r.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="blue" /></div>

  return (
    <div className="max-w-3xl space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
      <TransferDetail transfer={transfer} onValidated={setTransfer} />
    </div>
  )
}