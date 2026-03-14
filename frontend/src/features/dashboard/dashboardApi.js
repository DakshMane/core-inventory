import axiosInstance from '../../services/axiosInstance'

export const dashboardApi = {
  getKpis:     () => axiosInstance.get('/dashboard/kpis'),
  getActivity: () => axiosInstance.get('/dashboard/activity'),
}