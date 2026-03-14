import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from './routes'

export default function PrivateRoute() {
  const { token } = useSelector((state) => state.auth)
  return token ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}