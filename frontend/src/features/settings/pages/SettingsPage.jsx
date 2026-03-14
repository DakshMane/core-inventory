import { useEffect, useState } from 'react'
import { settingsApi } from '../settingsApi'
import WarehouseList from '../components/WarehouseList'
import WarehouseForm from '../components/WarehouseForm'
import LocationForm from '../components/LocationForm'
import UnitOfMeasureManager from '../components/UnitOfMeasureManager'
import { useToast } from '../../../hooks/useToast'

export default function SettingsPage() {
  const toast = useToast()
  const [warehouses, setWarehouses] = useState([])
  const [uoms, setUoms]             = useState([])
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    settingsApi.getWarehouses().then((r) => setWarehouses(r.data.data || []))
    settingsApi.getUoms().then((r) => setUoms(r.data.data || []))
  }, [])

  async function handleAddWarehouse(form) {
    setLoading(true)
    try {
      const res = await settingsApi.createWarehouse(form)
      setWarehouses((p) => [res.data.data, ...p])
      toast.success('Warehouse added!')
    } catch { toast.error('Failed to add warehouse') }
    finally { setLoading(false) }
  }

  async function handleDeleteWarehouse(id) {
    try {
      await settingsApi.deleteWarehouse(id)
      setWarehouses((p) => p.filter((w) => w.id !== id))
      toast.success('Warehouse removed')
    } catch { toast.error('Failed to remove') }
  }

  async function handleAddLocation(form) {
    try {
      await settingsApi.createLocation(form)
      toast.success('Location added!')
    } catch { toast.error('Failed to add location') }
  }

  async function handleAddUom(name) {
    try {
      const res = await settingsApi.createUom({ name })
      setUoms((p) => [...p, res.data.data])
      toast.success('Unit added!')
    } catch { toast.error('Failed to add unit') }
  }

  const section = (title) => (
    <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4">{title}</h3>
  )

  return (
    <div className="max-w-3xl space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {section('Warehouses')}
        <WarehouseForm onSubmit={handleAddWarehouse} loading={loading} />
        <div className="mt-4">
          <WarehouseList warehouses={warehouses} onDelete={handleDeleteWarehouse} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {section('Locations')}
        <LocationForm warehouses={warehouses} onSubmit={handleAddLocation} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {section('Units of Measure')}
        <UnitOfMeasureManager uoms={uoms} onCreate={handleAddUom} />
      </div>
    </div>
  )
}