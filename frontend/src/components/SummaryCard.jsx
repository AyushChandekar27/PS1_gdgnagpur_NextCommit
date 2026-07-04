import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

export const SummaryCard = ({ summary, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-2xl border border-teal-200/50 shadow-sm p-6 animate-pulse">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="h-6 w-6 bg-teal-300/40 rounded-full"></div>
          <div className="h-5 w-32 bg-slate-300/50 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-300/40 rounded-lg"></div>
          <div className="h-4 w-5/6 bg-slate-300/40 rounded-lg"></div>
          <div className="h-4 w-4/5 bg-slate-300/40 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-2xl shadow-md p-6 border border-teal-500 transition duration-200 hover:shadow-lg">
      {/* Background Sparkles decoration */}
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
        <Sparkles className="h-48 w-48 text-white" />
      </div>
      
      <div className="relative z-10 text-left">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-teal-200" />
          </div>
          <h3 className="font-outfit font-bold text-lg tracking-tight">AI Clinical Summary</h3>
        </div>
        
        {summary ? (
          <p className="text-sm font-medium text-teal-50/95 leading-relaxed font-sans whitespace-pre-line">
            {summary}
          </p>
        ) : (
          <div className="flex items-start space-x-2 text-teal-100 bg-white/10 rounded-xl p-3 border border-white/5">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed">
              No AI clinical summary is available yet. Upload medical documents (like lab reports, prescriptions, or scans) to automatically trigger analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
