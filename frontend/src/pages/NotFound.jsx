import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl flex flex-col items-center">
        <div className="h-14 w-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-5 shadow-sm shadow-teal-100">
          <HeartPulse className="h-8 w-8 pulse-glow-icon" />
        </div>
        
        <h1 className="font-outfit font-extrabold text-5xl text-slate-800 tracking-tight">404</h1>
        <h2 className="font-outfit font-bold text-xl text-slate-700 mt-3">Page Not Found</h2>
        
        <p className="text-sm font-semibold text-slate-400 mt-2.5 leading-relaxed">
          The health document or dossier portal view you are trying to reach does not exist or has been shifted.
        </p>

        <div className="mt-8 w-full">
          <Link
            to="/"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition duration-150 flex items-center justify-center space-x-2 shadow-lg shadow-teal-100"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Go to Portal Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
