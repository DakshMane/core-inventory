import { useState } from 'react'
import { authApi } from '../authApi'
import Button from '../../../components/ui/Button'

export default function OtpForm({ email, onVerified }) {
  const [otp, setOtp]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await authApi.verifyOtp({ email, otp })
      onVerified(otp)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Enter OTP</h2>
        <p className="text-gray-500 text-sm mt-1">
          We sent a code to <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        placeholder="------"
        className="w-full text-center text-2xl font-bold tracking-widest border border-gray-300 rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <Button type="submit" loading={loading} className="w-full">
        Verify OTP
      </Button>
    </form>
  )
}