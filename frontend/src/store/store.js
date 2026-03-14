import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import productsReducer from '../features/products/productsSlice'
import receiptsReducer from '../features/receipts/receiptsSlice'
import deliveriesReducer from '../features/deliveries/deliveriesSlice'
import transfersReducer from '../features/transfers/transfersSlice'
import adjustmentsReducer from '../features/adjustments/adjustmentsSlice'
import moveHistoryReducer from '../features/moveHistory/moveHistorySlice'
import settingsReducer from '../features/settings/settingsSlice'
import profileReducer from '../features/profile/profileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    products: productsReducer,
    receipts: receiptsReducer,
    deliveries: deliveriesReducer,
    transfers: transfersReducer,
    adjustments: adjustmentsReducer,
    moveHistory: moveHistoryReducer,
    settings: settingsReducer,
    profile: profileReducer,
  },
})