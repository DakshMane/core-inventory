import { useState } from 'react'
import { auth } from '../../../config/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/routes'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSendResetEmail(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Could not send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-500 text-sm mt-1">
            We've sent a password reset link to <span className="font-semibold text-gray-800">{email}</span>.
          </p>
        </div>
        <div className="pt-2">
          <Link to={ROUTES.LOGIN} className="text-sm font-medium text-blue-600 hover:underline">
            Return to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSendResetEmail} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Forgot password</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your email and we'll send you a secure reset link.
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
        Send reset link
      </Button>

      <p className="text-center text-sm text-gray-500">
        <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  )
}