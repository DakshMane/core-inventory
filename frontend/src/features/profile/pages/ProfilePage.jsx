import { useSelector } from 'react-redux'
import ProfileCard from '../components/ProfileCard'
import ProfileEditForm from '../components/ProfileEditForm'

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth)

  return (
    <div className="max-w-2xl space-y-6">
      <ProfileCard />
      <ProfileEditForm user={user} />
    </div>
  )
}