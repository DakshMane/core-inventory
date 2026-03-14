import { createSlice } from '@reduxjs/toolkit'

const moveHistorySlice = createSlice({
  name: 'moveHistory',
  initialState: { list: [], loading: false, error: null },
  reducers: {
    fetchStart(state)      { state.loading = true; state.error = null },
    fetchSuccess(state, a) { state.loading = false; state.list = a.payload },
    fetchFail(state, a)    { state.loading = false; state.error = a.payload },
  },
})

export const { fetchStart, fetchSuccess, fetchFail } = moveHistorySlice.actions
export default moveHistorySlice.reducer