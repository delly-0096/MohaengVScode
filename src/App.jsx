import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Styles
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Activities from './pages/Activities';

// Members
import GeneralMembers from './pages/members/GeneralMembers';
import BusinessMembers from './pages/members/BusinessMembers';
import Reports from './pages/members/Reports';
import Points from './pages/members/Points';

// Products
import Flights from './pages/products/Flights';
import Accommodations from './pages/products/Accommodations';
import Tours from './pages/products/Tours';
import Reservations from './pages/products/Reservations';

// Schedules
import Schedules from './pages/schedules/Schedules';

// Notifications
import Notifications from './pages/notifications/Notifications';


// Contents
import Destinations from './pages/contents/Destinations';
import Products from './pages/contents/Products';
import TravelTalk from './pages/contents/TravelTalk';
import TravelLogs from './pages/contents/TravelLogs';
import Community from './pages/contents/Community';
import ProductInquiries from './pages/contents/ProductInquiries';
import ProductReviews from './pages/contents/ProductReviews';
import FileManager from './pages/contents/FileManager';

// Transactions
import Payments from './pages/transactions/Payments';
import Refunds from './pages/transactions/Refunds';
import Settlements from './pages/transactions/Settlements';

// Support
import Notices from './pages/support/Notices';
import Faq from './pages/support/Faq';
import Inquiries from './pages/support/Inquiries';
import Chatbot from './pages/support/Chatbot';

// Statistics
import MemberStats from './pages/statistics/MemberStats';
import ServiceStats from './pages/statistics/ServiceStats';
import Algorithm from './pages/statistics/Algorithm';
import Logs from './pages/statistics/Logs';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="activities" element={<Activities />} />

        {/* Members */}
        <Route path="members">
          <Route path="general" element={<GeneralMembers />} />
          <Route path="business" element={<BusinessMembers />} />
          <Route path="points" element={<Points />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Products */}
        <Route path="products">
          <Route path="flights" element={<Flights />} />
          <Route path="accommodations" element={<Accommodations />} />
          <Route path="tours" element={<Tours />} />
        </Route>

        {/* Reservations */}
        <Route path="reservations">
          <Route index element={<Reservations />} />
          <Route path="inquiries" element={<ProductInquiries />} />
          <Route path="reviews" element={<ProductReviews />} />
        </Route>


        {/* Contents */}
        <Route path="contents">
          <Route path="destinations" element={<Destinations />} />
          <Route path="community" element={<Community />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="files" element={<FileManager />} />
          <Route path="products" element={<Products />} />
          <Route path="talk" element={<TravelTalk />} />
          <Route path="logs" element={<TravelLogs />} />
        </Route>

        {/* Transactions */}
        <Route path="transactions">
          <Route path="payments" element={<Payments />} />
          <Route path="refunds" element={<Refunds />} />
          <Route path="settlements" element={<Settlements />} />
        </Route>

        {/* Support */}
        <Route path="support">
          <Route path="notices" element={<Notices />} />
          <Route path="faq" element={<Faq />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Statistics */}
        <Route path="statistics">
          <Route path="members" element={<MemberStats />} />
          <Route path="services" element={<ServiceStats />} />
          <Route path="algorithm" element={<Algorithm />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Route>

      {/* Fallback - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
