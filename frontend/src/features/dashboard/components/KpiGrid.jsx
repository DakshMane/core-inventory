import KpiCard from './KpiCard'

export default function KpiGrid({ kpis = {} }) {
  const cards = [
    { title: 'Total Products',        value: kpis.totalProducts,    icon: '⬡', color: 'blue'   },
    { title: 'Low / Out of Stock',    value: kpis.lowStockCount,    icon: '⚠', color: 'orange' },
    { title: 'Pending Receipts',      value: kpis.pendingReceipts,  icon: '↓', color: 'purple' },
    { title: 'Pending Deliveries',    value: kpis.pendingDeliveries,icon: '↑', color: 'green'  },
    { title: 'Transfers Scheduled',   value: kpis.pendingTransfers, icon: '⇄', color: 'red'    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => <KpiCard key={c.title} {...c} />)}
    </div>
  )
}