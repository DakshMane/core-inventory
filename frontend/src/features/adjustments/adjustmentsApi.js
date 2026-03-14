import axiosInstance from '../../services/axiosInstance'

export const adjustmentsApi = {
  getAll: (params) => axiosInstance.get('/adjustments', { params }),
  create: (data)   => axiosInstance.post('/adjustments', data),
}