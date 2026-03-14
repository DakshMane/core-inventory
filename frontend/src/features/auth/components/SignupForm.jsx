import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure } from '../authSlice'
import { ROUTES } from '../../../routes/routes'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function SignupForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    dispatch(loginStart())

    // ✅ Mock signup — no backend needed
    setTimeout(() => {
      if (form.name && form.email && form.password.length >= 4) {
        dispatch(loginSuccess({
          user:  { name: form.name, email: form.email, role: 'Inventory Manager' },
          token: 'mock-token-123',
        }))
        navigate(ROUTES.DASHBOARD)
      } else {
        dispatch(loginFailure('Fill all fields. Password min 4 characters.'))
      }
    }, 600)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Create account</h2>
        <p className="text-gray-500 text-sm mt-1">Start managing your inventory</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="John Smith"
        required
      />
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
        placeholder="Min 4 characters"
        required
      />

      <Button type="submit" loading={loading} className="w-full">
        Create account
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  )
}