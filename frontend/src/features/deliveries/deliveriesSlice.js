import { createSlice } from '@reduxjs/toolkit'

const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState: { list: [], selected: null, loading: false, error: null },
  reducers: {
    fetchStart(state)         { state.loading = true; state.error = null },
    fetchSuccess(state, a)    { state.loading = false; state.list = a.payload },
    fetchOne(state, a)        { state.loading = false; state.selected = a.payload },
    addDelivery(state, a)     { state.list.unshift(a.payload) },
    updateDelivery(state, a)  { state.list = state.list.map((d) => d.id === a.payload.id ? a.payload : d) },
    fetchFail(state, a)       { state.loading = false; state.error = a.payload },
  },
})

export const { fetchStart, fetchSuccess, fetchOne, addDelivery, updateDelivery, fetchFail } = deliveriesSlice.actions
export default deliveriesSlice.reducer