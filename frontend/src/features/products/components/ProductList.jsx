import { useNavigate } from 'react-router-dom'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import { formatQty } from '../../../utils/formatQty'
import { ROUTES } from '../../../routes/routes'

export default function ProductList({ data = [], loading }) {
  const navigate = useNavigate()

  const columns = [
    { key: 'sku',      label: 'SKU' },
    { key: 'name',     label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'uom',      label: 'Unit' },
    { key: 'qty',      label: 'In Stock',
      render: (v, row) => formatQty(v, row.uom) },
    { key: 'status',   label: 'Status',
      render: (v) => <Badge status={v} /> },
  ]

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={(row) => navigate(`/products/${row.id}`)}
    />
  )
}