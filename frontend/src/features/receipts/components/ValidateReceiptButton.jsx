import { useState } from 'react'
import { receiptsApi } from '../receiptsApi'
import { useToast } from '../../../hooks/useToast'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'

export default function ValidateReceiptButton({ receiptId, status, onValidated }) {
  const toast = useToast()
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  if (status === 'done' || status === 'canceled') return null

  async function handleConfirm() {
    setLoading(true)
    try {
      const res = await receiptsApi.validate(receiptId)
      toast.success('Receipt validated — stock updated!')
      onValidated(res.data.data)
    } catch {
      toast.error('Validation failed')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="primary">
        ✓ Validate Receipt
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        title="Validate Receipt?"
        message="This will increase stock for all products in this receipt."
        confirmLabel="Validate"
      />
    </>
  )
}