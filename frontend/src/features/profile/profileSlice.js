import { createSlice } from '@reduxjs/toolkit'

const profileSlice = createSlice({
  name: 'profile',
  initialState: { data: null, loading: false, error: null },
  reducers: {
    fetchStart(state)      { state.loading = true; state.error = null },
    fetchSuccess(state, a) { state.loading = false; state.data = a.payload },
    updateSuccess(state, a){ state.data = { ...state.data, ...a.payload } },
    fetchFail(state, a)    { state.loading = false; state.error = a.payload },
  },
})

export const { fetchStart, fetchSuccess, updateSuccess, fetchFail } = profileSlice.actions
export default profileSlice.reducer