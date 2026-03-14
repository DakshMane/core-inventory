import axiosInstance from '../../services/axiosInstance'

export const authApi = {
  login:         (data) => axiosInstance.post('/auth/login', data),
  signup:        (data) => axiosInstance.post('/auth/signup', data),
  sendOtp:       (data) => axiosInstance.post('/auth/send-otp', data),
  verifyOtp:     (data) => axiosInstance.post('/auth/verify-otp', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
}