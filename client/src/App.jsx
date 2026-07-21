import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportEmergency from './pages/citizen/ReportEmergency';
import AIAnalysis from './pages/citizen/AIAnalysis';
import HistoryPage from './pages/citizen/HistoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Citizen Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="citizen">
            <DashboardLayout>
              <CitizenDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute role="citizen">
            <DashboardLayout>
              <ReportEmergency />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis/:id"
        element={
          <ProtectedRoute role="citizen">
            <DashboardLayout>
              <AIAnalysis />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute role="citizen">
            <DashboardLayout>
              <HistoryPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
