import { useState } from 'react'
import { transfersApi } from '../transfersApi'
import { useToast } from '../../../hooks/useToast'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'

export default function ValidateTransferButton({ transferId, status, onValidated }) {
  const toast = useToast()
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  if (status === 'done' || status === 'canceled') return null

  async function handleConfirm() {
    setLoading(true)
    try {
      const res = await transfersApi.validate(transferId)
      toast.success('Transfer validated — location updated!')
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
      <Button onClick={() => setOpen(true)}>✓ Validate Transfer</Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        title="Validate Transfer?"
        message="Stock will be moved to the destination location."
        confirmLabel="Validate"
      />
    </>
  )
}