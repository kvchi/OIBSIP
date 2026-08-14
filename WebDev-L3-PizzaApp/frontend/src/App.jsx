import { Routes, Route} from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ForgotResetPassword from './pages/ForgotResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PizzaBuilder from './pages/PizzaBuilder.jsx';
import Checkout from './pages/Checkout.jsx';
import Landing from './pages/Landing.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotResetPassword />} />
      <Route path="/reset-password/:token" element={<ForgotResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/builder" element={<ProtectedRoute> <PizzaBuilder /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute> <Checkout /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}