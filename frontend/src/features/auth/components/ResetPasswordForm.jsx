import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../authApi'
import { ROUTES } from '../../../routes/routes'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function ResetPasswordForm({ email, otp }) {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await authApi.resetPassword({ email, otp, password: form.password })
      navigate(ROUTES.LOGIN)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">New password</h2>
        <p className="text-gray-500 text-sm mt-1">Choose a strong password</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Input
        label="New Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Min. 8 characters"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirm"
        value={form.confirm}
        onChange={handleChange}
        placeholder="Repeat password"
        required
      />

      <Button type="submit" loading={loading} className="w-full">
        Reset Password
      </Button>
    </form>
  )
}