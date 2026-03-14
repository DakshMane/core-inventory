import { useNavigate } from 'react-router-dom'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import { formatQty } from '../../../utils/formatQty'
import { ROUTES } from '../../../routes/routes'

export default function ProductList({ data = [], loading }) {
  const navigate = useNavigate()

  const columns = [
    { key: 'name',     label: 'Product' },
    { key: 'qty',      label: 'On Hand',
      render: (v, row) => formatQty(v, row.uom) },
    { key: 'qty',      label: 'Free To Use',
      render: (v, row) => formatQty(v, row.uom) },
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