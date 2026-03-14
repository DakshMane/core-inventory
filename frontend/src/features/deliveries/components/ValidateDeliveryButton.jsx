import { useState } from 'react'
import { deliveriesApi } from '../deliveriesApi'
import { useToast } from '../../../hooks/useToast'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'

export default function ValidateDeliveryButton({ deliveryId, status, onValidated }) {
  const toast = useToast()
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  if (status === 'done' || status === 'canceled') return null

  async function handleConfirm() {
    setLoading(true)
    try {
      const res = await deliveriesApi.validate(deliveryId)
      toast.success('Delivery validated — stock reduced!')
      onValidated(res.data)
    } catch {
      toast.error('Validation failed')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>✓ Validate Delivery</Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        title="Validate Delivery?"
        message="This will decrease stock for all products in this delivery."
        confirmLabel="Validate"
      />
    </>
  )
}