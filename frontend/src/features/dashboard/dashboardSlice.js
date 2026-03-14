import { createSlice } from '@reduxjs/toolkit'

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    kpis:     {},
    activity: [],
    loading:  false,
    error:    null,
  },
  reducers: {
    fetchStart(state)        { state.loading = true; state.error = null },
    fetchKpis(state, a)      { state.loading = false; state.kpis = a.payload },
    fetchActivity(state, a)  { state.loading = false; state.activity = a.payload },
    fetchFail(state, a)      { state.loading = false; state.error = a.payload },
  },
})

export const { fetchStart, fetchKpis, fetchActivity, fetchFail } = dashboardSlice.actions
export default dashboardSlice.reducer