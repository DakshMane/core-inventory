import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsApi } from '../productsApi'
import ProductForm from '../components/ProductForm'
import { useToast } from '../../../hooks/useToast'

export default function ProductFormPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const toast    = useToast()
  const isEdit   = Boolean(id)

  const [initial, setInitial]     = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    productsApi.getCategories().then((r) => setCategories(r.data))
    if (isEdit) productsApi.getOne(id).then((r) => setInitial(r.data))
  }, [id])

  async function handleSubmit(form) {
    setLoading(true)
    try {
      isEdit
        ? await productsApi.update(id, form)
        : await productsApi.create(form)
      toast.success(`Product ${isEdit ? 'updated' : 'created'}!`)
      navigate('/products')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {isEdit ? 'Edit Product' : 'New Product'}
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm
          initial={initial}
          categories={categories}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}