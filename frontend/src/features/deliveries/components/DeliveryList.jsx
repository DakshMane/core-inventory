import { useNavigate } from 'react-router-dom'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/formatDate'

export default function DeliveryList({ data = [], loading }) {
  const navigate = useNavigate()

  const columns = [
    { key: 'ref',           label: 'Reference' },
    { key: 'sourceLocation',label: 'From',   render: () => 'WH/Stock' }, // Backend primarily routes from main stock initially
    { key: 'customer',      label: 'Location'  },
    { key: 'scheduledDate', label: 'Scheduled Date', render: (v) => formatDate(v) },
    { key: 'status',        label: 'Status', render: (v) => <Badge status={v} /> },
  ]

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={(row) => navigate(`/deliveries/${row.id}`)}
    />
  )
}