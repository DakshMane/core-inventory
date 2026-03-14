import { createSlice } from '@reduxjs/toolkit'

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { warehouses: [], locations: [], uoms: [], loading: false, error: null },
  reducers: {
    fetchStart(state)          { state.loading = true; state.error = null },
    fetchWarehouses(state, a)  { state.loading = false; state.warehouses = a.payload },
    fetchLocations(state, a)   { state.locations = a.payload },
    fetchUoms(state, a)        { state.uoms = a.payload },
    addWarehouse(state, a)     { state.warehouses.unshift(a.payload) },
    removeWarehouse(state, a)  { state.warehouses = state.warehouses.filter((w) => w.id !== a.payload) },
    fetchFail(state, a)        { state.loading = false; state.error = a.payload },
  },
})

export const { fetchStart, fetchWarehouses, fetchLocations, fetchUoms, addWarehouse, removeWarehouse, fetchFail } = settingsSlice.actions
export default settingsSlice.reducer