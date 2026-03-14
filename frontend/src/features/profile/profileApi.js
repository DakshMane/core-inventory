import axiosInstance from '../../services/axiosInstance'

export const profileApi = {
  getMe:          ()     => axiosInstance.get('/profile/me'),
  update:         (data) => axiosInstance.put('/profile/me', data),
  changePassword: (data) => axiosInstance.put('/profile/password', data),
}