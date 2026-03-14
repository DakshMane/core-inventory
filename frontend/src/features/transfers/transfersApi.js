import axiosInstance from '../../services/axiosInstance'

export const transfersApi = {
  getAll:      (params) => axiosInstance.get('/transfers', { params }),
  getOne:      (id)     => axiosInstance.get(`/transfers/${id}`),
  create:      (data)   => axiosInstance.post('/transfers', data),
  update:      (id, d)  => axiosInstance.put(`/transfers/${id}`, d),
  validate:    (id)     => axiosInstance.post(`/transfers/${id}/validate`),
  getLocations:()       => axiosInstance.get('/warehouses/locations'),
}