import Table from '../../../components/ui/Table'
import { formatDate } from '../../../utils/formatDate'
import DiffBadge from './DiffBadge'

export default function AdjustmentList({ data = [], loading }) {
  const columns = [
    { key: 'productName', label: 'Product'  },
    { key: 'location',    label: 'Location' },
    { key: 'expectedQty', label: 'Recorded' },
    { key: 'countedQty',  label: 'Counted'  },
    { key: 'diff',        label: 'Diff',
      render: (_, row) => <DiffBadge expected={row.expectedQty} counted={row.countedQty} /> },
    { key: 'reason',      label: 'Reason'   },
    { key: 'createdAt',   label: 'Date',    render: (v) => formatDate(v) },
  ]

  return <Table columns={columns} data={data} loading={loading} />
}