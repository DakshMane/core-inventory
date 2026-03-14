import { useEffect, useState } from 'react'
import Select from '../../../components/ui/Select'
import { transfersApi } from '../transfersApi'

export default function LocationSelector({ label, name, value, onChange }) {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    transfersApi.getLocations()
      .then((r) => setLocations(r.data.map((l) => ({ value: l.id, label: `${l.warehouse} — ${l.name}` }))))
      .catch(() => {})
  }, [])

  return (
    <Select
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      options={locations}
      placeholder="Select location"
    />
  )
}