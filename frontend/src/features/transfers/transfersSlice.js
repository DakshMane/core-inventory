import { createSlice } from '@reduxjs/toolkit'

const transfersSlice = createSlice({
  name: 'transfers',
  initialState: { list: [], selected: null, loading: false, error: null },
  reducers: {
    fetchStart(state)         { state.loading = true; state.error = null },
    fetchSuccess(state, a)    { state.loading = false; state.list = a.payload },
    fetchOne(state, a)        { state.loading = false; state.selected = a.payload },
    addTransfer(state, a)     { state.list.unshift(a.payload) },
    updateTransfer(state, a)  { state.list = state.list.map((t) => t.id === a.payload.id ? a.payload : t) },
    fetchFail(state, a)       { state.loading = false; state.error = a.payload },
  },
})

export const { fetchStart, fetchSuccess, fetchOne, addTransfer, updateTransfer, fetchFail } = transfersSlice.actions
export default transfersSlice.reducer