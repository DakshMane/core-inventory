import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure } from '../authSlice'
import { ROUTES } from '../../../routes/routes'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    dispatch(loginStart())

    // ✅ Mock login — no backend needed
    setTimeout(() => {
      if (form.email && form.password.length >= 4) {
        dispatch(loginSuccess({
          user:  { name: form.email.split('@')[0], email: form.email, role: 'Inventory Manager' },
          token: 'mock-token-123',
        }))
        navigate(ROUTES.DASHBOARD)
      } else {
        dispatch(loginFailure('Enter a valid email and password (min 4 chars)'))
      }
    }, 600)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="you@company.com"
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="min 4 characters"
        required
      />

      <div className="text-right">
        <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-500">
        No account?{' '}
        <Link to={ROUTES.SIGNUP} className="text-blue-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  )
}