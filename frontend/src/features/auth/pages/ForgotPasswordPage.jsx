import { useState } from 'react'
import { authApi } from '../authApi'
import OtpForm from '../components/OtpForm'
import ResetPasswordForm from '../components/ResetPasswordForm'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/routes'

const STEP = { EMAIL: 'email', OTP: 'otp', RESET: 'reset' }

export default function ForgotPasswordPage() {
  const [step, setStep]     = useState(STEP.EMAIL)
  const [email, setEmail]   = useState('')
  const [otp, setOtp]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  async function handleSendOtp(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await authApi.sendOtp({ email })
      setStep(STEP.OTP)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send OTP')
    } finally {
      setLoading(false)
    }
  }

  if (step === STEP.OTP)
    return <OtpForm email={email} onVerified={(o) => { setOtp(o); setStep(STEP.RESET) }} />

  if (step === STEP.RESET)
    return <ResetPasswordForm email={email} otp={otp} />

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Forgot password</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your email and we'll send you an OTP
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
      />

      <Button type="submit" loading={loading} className="w-full">
        Send OTP
      </Button>

      <p className="text-center text-sm text-gray-500">
        <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  )
}