import { createSlice } from '@reduxjs/toolkit'

const receiptsSlice = createSlice({
  name: 'receipts',
  initialState: { list: [], selected: null, loading: false, error: null },
  reducers: {
    fetchStart(state)       { state.loading = true; state.error = null },
    fetchSuccess(state, a)  { state.loading = false; state.list = a.payload },
    fetchOne(state, a)      { state.loading = false; state.selected = a.payload },
    addReceipt(state, a)    { state.list.unshift(a.payload) },
    updateReceipt(state, a) { state.list = state.list.map((r) => r.id === a.payload.id ? a.payload : r) },
    fetchFail(state, a)     { state.loading = false; state.error = a.payload },
  },
})

export const { fetchStart, fetchSuccess, fetchOne, addReceipt, updateReceipt, fetchFail } = receiptsSlice.actions
export default receiptsSlice.reducer