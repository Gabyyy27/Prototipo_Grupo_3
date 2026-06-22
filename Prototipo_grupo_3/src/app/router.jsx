import { Navigate, Route, Routes } from 'react-router-dom';
import SplashPage from '../pages/SplashPage.jsx';
import OnboardingPage from '../pages/OnboardingPage.jsx';
import WelcomePage from '../pages/WelcomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import WhatsAppLinkPage from '../pages/WhatsAppLinkPage.jsx';
import WhatsAppVerifyPage from '../pages/WhatsAppVerifyPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import InventoryPage from '../pages/InventoryPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import ProductFormPage from '../pages/ProductFormPage.jsx';
import FinancialHistoryPage from '../pages/FinancialHistoryPage.jsx';
import ChatbotPage from '../pages/ChatbotPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/whatsapp-link" element={<WhatsAppLinkPage />} />
      <Route path="/whatsapp-verify" element={<WhatsAppVerifyPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/inventory/new" element={<ProductFormPage mode="create" />} />
      <Route path="/inventory/:productId" element={<ProductDetailPage />} />
      <Route path="/inventory/:productId/edit" element={<ProductFormPage mode="edit" />} />
      <Route path="/history" element={<FinancialHistoryPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
