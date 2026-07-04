import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authApi from '../api/authApi';
import { HeartPulse, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setValidationError('');
    setApiError('');

    // Validations
    if (!email || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      login(data);
      if (data.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl transition-all duration-200 hover:shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4 shadow-sm shadow-teal-100">
            <HeartPulse className="h-7 w-7 pulse-glow-icon" />
          </div>
          <h2 className="font-outfit font-extrabold text-3xl tracking-tight bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm font-medium text-slate-400">
            Access your AI-powered health portal
          </p>
        </div>

        {/* Error Cards */}
        {(validationError || apiError) && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-4 rounded-xl flex items-start space-x-2.5 text-left">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Login failed</p>
              <p className="mt-0.5 font-medium">{validationError || apiError}</p>
            </div>
          </div>
        )}

        <form className="mt-6 space-y-4 text-left" onSubmit={handleLogin}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition duration-150 flex items-center justify-center space-x-2 shadow-lg shadow-teal-100 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              <span>Sign In</span>
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm font-semibold text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 hover:underline font-bold transition">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
