import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl flex flex-col items-center">
        <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-5 shadow-sm shadow-rose-100">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <h1 className="font-outfit font-extrabold text-3xl text-slate-800 tracking-tight">Access Locked</h1>
        <h2 className="font-outfit font-bold text-sm text-rose-600 uppercase tracking-widest mt-1.5">
          Role Unauthorized
        </h2>
        
        <p className="text-sm font-semibold text-slate-400 mt-3.5 leading-relaxed">
          Your portal user credentials do not authorize access to this directory section. Please contact administration for authorization elevation.
        </p>

        <div className="mt-8 w-full">
          <Link
            to="/"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition duration-150 flex items-center justify-center space-x-2 shadow-lg"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>Return to Safe Zone</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
