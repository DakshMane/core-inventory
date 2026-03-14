import { useSelector } from 'react-redux'

export function useAuth() {
  const { user, token } = useSelector((s) => s.auth)
  return { user, token, isLoggedIn: !!token }
}