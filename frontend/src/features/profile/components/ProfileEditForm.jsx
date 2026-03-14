import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { profileApi } from '../profileApi'
import { loginSuccess } from '../../auth/authSlice'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useToast } from '../../../hooks/useToast'

export default function ProfileEditForm({ user }) {
  const dispatch = useDispatch()
  const toast    = useToast()
  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '' })
  const [pass, setPass]       = useState({ current: '', newPass: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  async function handleProfile(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await profileApi.update(form)
      dispatch(loginSuccess({ user: res.data, token: localStorage.getItem('ci_token') }))
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    finally { setLoading(false) }
  }

  async function handlePassword(e) {
    e.preventDefault()
    if (pass.newPass !== pass.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await profileApi.changePassword({ current: pass.current, password: pass.newPass })
      toast.success('Password changed!')
      setPass({ current: '', newPass: '', confirm: '' })
    } catch { toast.error('Change failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleProfile} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Edit Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" value={form.name}  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}  required />
          <Input label="Email"     value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} type="email" required />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" loading={loading}>Save Changes</Button>
        </div>
      </form>

      <form onSubmit={handlePassword} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Change Password</h3>
        <Input label="Current Password" type="password" value={pass.current} onChange={(e) => setPass((p) => ({ ...p, current: e.target.value }))} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="New Password"     type="password" value={pass.newPass} onChange={(e) => setPass((p) => ({ ...p, newPass: e.target.value }))} required />
          <Input label="Confirm Password" type="password" value={pass.confirm} onChange={(e) => setPass((p) => ({ ...p, confirm: e.target.value }))} required />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" loading={loading}>Change Password</Button>
        </div>
      </form>
    </div>
  )
}