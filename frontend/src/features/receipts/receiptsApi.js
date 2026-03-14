import axiosInstance from '../../services/axiosInstance'

export const receiptsApi = {
  getAll:   (params) => axiosInstance.get('/receipts', { params }),
  getOne:   (id)     => axiosInstance.get(`/receipts/${id}`),
  create:   (data)   => axiosInstance.post('/receipts', data),
  update:   (id, d)  => axiosInstance.put(`/receipts/${id}`, d),
  validate: (id)     => axiosInstance.post(`/receipts/${id}/validate`),
}