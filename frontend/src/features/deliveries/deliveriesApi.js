import axiosInstance from '../../services/axiosInstance'

export const deliveriesApi = {
  getAll:   (params) => axiosInstance.get('/deliveries', { params }),
  getOne:   (id)     => axiosInstance.get(`/deliveries/${id}`),
  create:   (data)   => axiosInstance.post('/deliveries', data),
  update:   (id, d)  => axiosInstance.put(`/deliveries/${id}`, d),
  validate: (id)     => axiosInstance.post(`/deliveries/${id}/validate`),
}