import { createSlice } from '@reduxjs/toolkit'

const adjustmentsSlice = createSlice({
  name: 'adjustments',
  initialState: { list: [], loading: false, error: null },
  reducers: {
    fetchStart(state)       { state.loading = true; state.error = null },
    fetchSuccess(state, a)  { state.loading = false; state.list = a.payload },
    addAdjustment(state, a) { state.list.unshift(a.payload) },
    fetchFail(state, a)     { state.loading = false; state.error = a.payload },
  },
})

export const { fetchStart, fetchSuccess, addAdjustment, fetchFail } = adjustmentsSlice.actions
export default adjustmentsSlice.reducer