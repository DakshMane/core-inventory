import axiosInstance from '../../services/axiosInstance'

export const authApi = {
  login:         (data) => axiosInstance.post('/user/login', data),
  signup:        (data) => axiosInstance.post('/user/register', data),
  sendOtp:       (data) => axiosInstance.post('/user/send-otp', data),
  verifyOtp:     (data) => axiosInstance.post('/user/verify-otp', data),
  resetPassword: (data) => axiosInstance.post('/user/reset-password', data),
}
