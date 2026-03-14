import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import PrivateRoute from './PrivateRoute'
import AppShell from '../components/layout/AppShell'
import AuthLayout from '../components/layout/AuthLayout'

// Auth pages
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage'
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage'

// App pages
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import ProductListPage from '../features/products/pages/ProductListPage'
import ProductDetailPage from '../features/products/pages/ProductDetailPage'
import ProductFormPage from '../features/products/pages/ProductFormPage'
import ReceiptListPage from '../features/receipts/pages/ReceiptListPage'
import ReceiptDetailPage from '../features/receipts/pages/ReceiptDetailPage'
import ReceiptFormPage from '../features/receipts/pages/ReceiptFormPage'
import DeliveryListPage from '../features/deliveries/pages/DeliveryListPage'
import DeliveryDetailPage from '../features/deliveries/pages/DeliveryDetailPage'
import DeliveryFormPage from '../features/deliveries/pages/DeliveryFormPage'
import TransferListPage from '../features/transfers/pages/TransferListPage'
import TransferDetailPage from '../features/transfers/pages/TransferDetailPage'
import TransferFormPage from '../features/transfers/pages/TransferFormPage'
import AdjustmentListPage from '../features/adjustments/pages/AdjustmentListPage'
import AdjustmentFormPage from '../features/adjustments/pages/AdjustmentFormPage'
import MoveHistoryPage from '../features/moveHistory/pages/MoveHistoryPage'
import SettingsPage from '../features/settings/pages/SettingsPage'
import ProfilePage from '../features/profile/pages/ProfilePage'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppShell />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

          <Route path={ROUTES.PRODUCTS} element={<ProductListPage />} />
          <Route path={ROUTES.PRODUCT_NEW} element={<ProductFormPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
          <Route path={ROUTES.PRODUCT_EDIT} element={<ProductFormPage />} />

          <Route path={ROUTES.RECEIPTS} element={<ReceiptListPage />} />
          <Route path={ROUTES.RECEIPT_NEW} element={<ReceiptFormPage />} />
          <Route path={ROUTES.RECEIPT_DETAIL} element={<ReceiptDetailPage />} />

          <Route path={ROUTES.DELIVERIES} element={<DeliveryListPage />} />
          <Route path={ROUTES.DELIVERY_NEW} element={<DeliveryFormPage />} />
          <Route path={ROUTES.DELIVERY_DETAIL} element={<DeliveryDetailPage />} />

          <Route path={ROUTES.TRANSFERS} element={<TransferListPage />} />
          <Route path={ROUTES.TRANSFER_NEW} element={<TransferFormPage />} />
          <Route path={ROUTES.TRANSFER_DETAIL} element={<TransferDetailPage />} />

          <Route path={ROUTES.ADJUSTMENTS} element={<AdjustmentListPage />} />
          <Route path={ROUTES.ADJUSTMENT_NEW} element={<AdjustmentFormPage />} />

          <Route path={ROUTES.MOVE_HISTORY} element={<MoveHistoryPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  )
}