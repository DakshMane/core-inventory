import axiosInstance from '../../services/axiosInstance'

export const settingsApi = {
  getWarehouses:    ()       => axiosInstance.get('/warehouses'),
  createWarehouse:  (data)   => axiosInstance.post('/warehouses', data),
  deleteWarehouse:  (id)     => axiosInstance.delete(`/warehouses/${id}`),
  getLocations:     (wId)    => axiosInstance.get(`/warehouses/${wId}/locations`),
  createLocation:   (data)   => axiosInstance.post('/warehouses/locations', data),
  getUoms:          ()       => axiosInstance.get('/uoms'),
  createUom:        (data)   => axiosInstance.post('/uoms', data),
}