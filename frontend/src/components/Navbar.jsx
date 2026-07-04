import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, LogOut, User, Stethoscope, Search, Upload, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { name, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUploadClick = (e) => {
    if (location.pathname === '/dashboard') {
      e.preventDefault();
      const el = document.getElementById('upload-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to={role === 'DOCTOR' ? '/doctor/dashboard' : '/dashboard'} className="flex items-center space-x-2">
              <HeartPulse className="h-8 w-8 text-teal-500 pulse-glow-icon" />
              <span className="font-outfit font-bold text-xl tracking-tight bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                HealthBridge AI
              </span>
            </Link>
            
            {/* Nav links change based on authenticated user's role */}
            <div className="hidden md:flex space-x-4">
              {role === 'PATIENT' ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition"
                  >
                    <LayoutDashboard className="h-4.5 w-4.5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard#upload-section"
                    onClick={handleUploadClick}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition"
                  >
                    <Upload className="h-4.5 w-4.5" />
                    <span>Upload</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/doctor/dashboard"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition"
                >
                  <Search className="h-4.5 w-4.5" />
                  <span>Search Patients</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 border-r border-slate-200 pr-4">
              <div className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                {role === 'DOCTOR' ? <Stethoscope className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{name}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                  role === 'DOCTOR' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'bg-teal-50 text-teal-700 border border-teal-200'
                }`}>
                  {role}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition duration-150"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
