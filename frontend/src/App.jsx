import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDetail from './pages/PatientDetail';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

export const App = () => {
  const location = useLocation();

  // Determine if Navbar should be hidden (hide on auth pages)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full">
      {!isAuthPage && <Navbar />}
      
      <main className="flex-1 flex flex-col w-full">
        <Routes>
          {/* Public Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Patient-specific Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="PATIENT">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Doctor-specific Protected routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute role="DOCTOR">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients/:id"
            element={
              <ProtectedRoute role="DOCTOR">
                <PatientDetail />
              </ProtectedRoute>
            }
          />

          {/* Error & Helper fallback routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Root redirect: maps to login, route-guards will redirect to dashboard if authenticated */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
