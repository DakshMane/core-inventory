import { useEffect, useState } from 'react'
import { dashboardApi } from '../dashboardApi'
import KpiGrid from '../components/KpiGrid'
import DashboardFilters from '../components/DashboardFilters'
import ActivityFeed from '../components/ActivityFeed'
import LowStockAlert from '../components/LowStockAlert'
import Spinner from '../../../components/ui/Spinner'

export default function DashboardPage() {
  const [kpis, setKpis]         = useState({})
  const [activity, setActivity] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filters, setFilters]   = useState({ type: '', status: '' })

  useEffect(() => {
    async function load() {
      try {
        const [k, a] = await Promise.all([
          dashboardApi.getKpis(),
          dashboardApi.getActivity(),
        ])
        setKpis(k.data)
        setActivity(a.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleFilter(key, val) {
    setFilters((prev) => ({ ...prev, [key]: val }))
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" color="blue" /></div>

  return (
    <div className="space-y-6">
      <LowStockAlert count={kpis.lowStock} />
      <KpiGrid kpis={kpis} />

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Recent Activity</h2>
          <DashboardFilters filters={filters} onChange={handleFilter} />
        </div>
        <ActivityFeed activity={activity} />
      </div>
    </div>
  )
}