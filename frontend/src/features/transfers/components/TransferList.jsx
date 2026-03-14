import { useNavigate } from 'react-router-dom'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/formatDate'

export default function TransferList({ data = [], loading }) {
  const navigate = useNavigate()

  const columns = [
    { key: 'ref',           label: 'Reference' },
    { key: 'fromLocation',  label: 'From'      },
    { key: 'toLocation',    label: 'To'        },
    { key: 'scheduledDate', label: 'Date',     render: (v) => formatDate(v) },
    { key: 'status',        label: 'Status',   render: (v) => <Badge status={v} /> },
  ]

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={(row) => navigate(`/transfers/${row.id}`)}
    />
  )
}