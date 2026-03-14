import axiosInstance from '../../services/axiosInstance'

export const dashboardApi = {
  getDashboard: () => axiosInstance.get('/dashboard'),
}