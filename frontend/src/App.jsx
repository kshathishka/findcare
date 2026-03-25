import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HospitalsPage from './pages/HospitalsPage';
import HospitalDetailPage from './pages/HospitalDetailPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage';
import ReceptionistPage from './pages/ReceptionistPage';

export default function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-900 focus:shadow-elevated"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div key={location.pathname} className="animate-fade-in">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:id" element={<DoctorDetailPage />} />

            {/* Patient routes */}
            <Route
              path="/appointments"
              element={
                <ProtectedRoute roles={['PATIENT']}>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />

            {/* Doctor routes */}
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute roles={['DOCTOR']}>
                  <DoctorAppointmentsPage />
                </ProtectedRoute>
              }
            />

            {/* Receptionist routes */}
            <Route
              path="/receptionist"
              element={
                <ProtectedRoute roles={['RECEPTIONIST']}>
                  <ReceptionistPage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
