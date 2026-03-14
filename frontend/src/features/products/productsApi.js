import axiosInstance from '../../services/axiosInstance'

export const productsApi = {
  getAll:       (params) => axiosInstance.get('/products', { params }),
  getOne:       (id)     => axiosInstance.get(`/products/${id}`),
  create:       (data)   => axiosInstance.post('/products', data),
  update:       (id, data) => axiosInstance.patch(`/products/${id}`, data),
  remove:       (id)     => axiosInstance.delete(`/products/${id}`),
  getCategories:()       => axiosInstance.get('/categories'),
  getLocations: ()       => axiosInstance.get('/locations'),
  getStock:     (id)     => axiosInstance.get(`/products/${id}/stock`),
}