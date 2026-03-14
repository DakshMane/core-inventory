import axiosInstance from '../../services/axiosInstance'

export const moveHistoryApi = {
  getAll: (params) => axiosInstance.get('/move-history', { params }),
}