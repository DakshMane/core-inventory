import MoveHistoryRow from './MoveHistoryRow'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'

export default function MoveHistoryTable({ data = [], loading }) {
  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="blue" /></div>
  if (!data.length) return <EmptyState title="No movements found" icon="📋" />

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Type', 'Product', 'From', 'To', 'Qty', 'Operation', 'Date'].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((move, i) => <MoveHistoryRow key={i} move={move} />)}
        </tbody>
      </table>
    </div>
  )
}