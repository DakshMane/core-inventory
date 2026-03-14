import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productsApi } from '../productsApi'
import ProductList from '../components/ProductList'
import SearchInput from '../../../components/forms/SearchInput'
import Button from '../../../components/ui/Button'
import { ROUTES } from '../../../routes/routes'

export default function ProductListPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    productsApi.getAll({ search })
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false))
  }, [search])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
        <Button onClick={() => navigate(ROUTES.PRODUCT_NEW)}>+ New Product</Button>
      </div>
      <SearchInput onSearch={setSearch} placeholder="Search by name or SKU..." className="max-w-sm" />
      <ProductList data={products} loading={loading} />
    </div>
  )
}