import { createSlice } from '@reduxjs/toolkit'

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list:       [],
    selected:   null,
    categories: [],
    loading:    false,
    error:      null,
  },
  reducers: {
    fetchStart(state)          { state.loading = true; state.error = null },
    fetchSuccess(state, a)     { state.loading = false; state.list = a.payload },
    fetchOne(state, a)         { state.loading = false; state.selected = a.payload },
    fetchCategories(state, a)  { state.categories = a.payload },
    addProduct(state, a)       { state.list.unshift(a.payload) },
    updateProduct(state, a)    { state.list = state.list.map((p) => p.id === a.payload.id ? a.payload : p) },
    deleteProduct(state, a)    { state.list = state.list.filter((p) => p.id !== a.payload) },
    fetchFail(state, a)        { state.loading = false; state.error = a.payload },
  },
})

export const {
  fetchStart, fetchSuccess, fetchOne, fetchCategories,
  addProduct, updateProduct, deleteProduct, fetchFail,
} = productsSlice.actions
export default productsSlice.reducer