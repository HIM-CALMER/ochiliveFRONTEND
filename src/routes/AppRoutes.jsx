import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import SignUpPage from '../pages/SignUpPage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import HomePage from '../pages/HomePage';
import DiscoverPage from '../pages/DiscoverPage';
import MoreUpcomingShowsPage from '../pages/MoreUpcomingShowsPage';
import MorePopularClipsPage from '../pages/MorePopularClipsPage';
import ActivityPage from '../pages/ActivityPage';
import WalletShell from '../pages/wallet/WalletShell';
import WalletLanding from '../pages/wallet/WalletLanding';
import WalletOverview from '../pages/wallet/WalletOverview';
import WalletRevenue from '../pages/wallet/WalletRevenue';
import WalletTransactions from '../pages/wallet/WalletTransactions';
import WalletWithdrawals from '../pages/wallet/WalletWithdrawals';
import ProfilePage from '../pages/ProfilePage';
import UploadPage from '../pages/UploadPage';
import NotificationsPage from '../pages/NotificationsPage';
import MessagesPage from '../pages/MessagesPage';
import SettingsPage from '../pages/SettingsPage';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/discover/more-upcoming-shows" element={<MoreUpcomingShowsPage />} />
      <Route path="/discover/more-popular-clips" element={<MorePopularClipsPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><WalletShell /></ProtectedRoute>} />
      <Route path="/wallet/overview" element={<ProtectedRoute><WalletOverview /></ProtectedRoute>} />
      <Route path="/wallet/revenue" element={<ProtectedRoute><WalletRevenue /></ProtectedRoute>} />
      <Route path="/wallet/transactions" element={<ProtectedRoute><WalletTransactions /></ProtectedRoute>} />
      <Route path="/wallet/withdrawals" element={<ProtectedRoute><WalletWithdrawals /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;
