import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsApi } from '../productsApi'
import ProductDetail from '../components/ProductDetail'
import StockByLocation from '../components/StockByLocation'
import ReorderRuleForm from '../components/ReorderRuleForm'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsApi.getOne(id)
      .then((r) => {
        const d = r.data.data
        if (d) setProduct({ ...d, uom: d.unitOfMeasure, id: d._id })
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="blue" /></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
        <Button size="sm" variant="outline" onClick={() => navigate(`/products/${id}/edit`)}>Edit</Button>
      </div>
      <ProductDetail product={product} />
      <StockByLocation productId={id} uom={product?.uom} />
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Reorder Rule</h3>
        <ReorderRuleForm productId={id} onSave={(d) => console.log(d)} />
      </div>
    </div>
  )
}