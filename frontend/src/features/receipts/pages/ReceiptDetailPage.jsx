import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { receiptsApi } from '../receiptsApi'
import ReceiptDetail from '../components/ReceiptDetail'
import Spinner from '../../../components/ui/Spinner'

export default function ReceiptDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    receiptsApi.getOne(id)
      .then((r) => setReceipt(r.data.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="blue" /></div>

  return (
    <div className="max-w-3xl space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
      <ReceiptDetail receipt={receipt} onValidated={setReceipt} />
    </div>
  )
}