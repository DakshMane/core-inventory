import { createSlice } from '@reduxjs/toolkit'
import { tokenService } from '../../services/tokenService'

const initialState = {
  user:    JSON.parse(localStorage.getItem('ci_user')) || null,
  token:   tokenService.get() || null,
  loading: false,
  error:   null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state)        { state.loading = true; state.error = null },
    loginSuccess(state, a)   {
      state.loading = false
      state.user    = a.payload.user
      state.token   = a.payload.token
      tokenService.set(a.payload.token)
      localStorage.setItem('ci_user', JSON.stringify(a.payload.user))
    },
    loginFailure(state, a)   { state.loading = false; state.error = a.payload },
    logout(state)            {
      state.user  = null
      state.token = null
      tokenService.clear()
      localStorage.removeItem('ci_user')
    },
    clearError(state)        { state.error = null },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions
export default authSlice.reducer