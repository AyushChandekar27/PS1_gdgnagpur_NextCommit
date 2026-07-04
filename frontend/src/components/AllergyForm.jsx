import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import patientApi from '../api/patientApi';

export const AllergyForm = ({ patientId, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    severity: 'MILD',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Allergy name is required.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await patientApi.addAllergy(patientId, formData);
      onSubmitSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add allergy. Please check connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-outfit font-bold text-slate-800 text-base">Add Allergy</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-3 rounded-xl">
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Allergen / Substance Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Penicillin, Peanuts"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Severity Level
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="MILD">Mild (Rash, itching)</option>
              <option value="MODERATE">Moderate (Hives, mild wheezing)</option>
              <option value="SEVERE">Severe (Anaphylaxis, difficulty breathing)</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center space-x-1.5 shadow-sm shadow-teal-100 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Add Allergy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllergyForm;
