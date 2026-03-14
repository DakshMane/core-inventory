import Badge from '../../../components/ui/Badge'
import { formatDate } from '../../../utils/formatDate'
import { formatQty } from '../../../utils/formatQty'

export default function MoveHistoryRow({ move }) {
  const typeIcon = {
    receipt:    '↓',
    delivery:   '↑',
    transfer:   '⇄',
    adjustment: '⊡',
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3 text-gray-500 text-sm">{typeIcon[move.type] || '•'}</td>
      <td className="px-5 py-3 text-gray-800 text-sm font-medium">{move.productName}</td>
      <td className="px-5 py-3 text-gray-500 text-sm">{move.from || '—'}</td>
      <td className="px-5 py-3 text-gray-500 text-sm">{move.to || '—'}</td>
      <td className="px-5 py-3 text-sm">
        <span className={`font-semibold ${move.qty > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {move.qty > 0 ? `+${formatQty(move.qty)}` : formatQty(move.qty)}
        </span>
      </td>
      <td className="px-5 py-3"><Badge status={move.type} label={move.type} /></td>
      <td className="px-5 py-3 text-gray-400 text-sm">{formatDate(move.date)}</td>
    </tr>
  )
}