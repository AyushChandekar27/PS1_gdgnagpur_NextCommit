import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorApi from '../api/doctorApi';
import { Search, User, Mail, ChevronRight, Loader2 } from 'lucide-react';

export const DoctorDashboard = () => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Debounced patient search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchPatients = async () => {
        setLoading(true);
        try {
          const data = await doctorApi.searchPatients(query);
          setPatients(data || []);
          setError(null);
        } catch (err) {
          console.error(err);
          setError('Failed to query patient catalog. Please check authentication and server status.');
        } finally {
          setLoading(false);
        }
      };

      fetchPatients();
    }, 400); // 400ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handlePatientClick = (patientId) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full text-left">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-slate-200">
        <h1 className="font-outfit font-extrabold text-3xl text-slate-900 tracking-tight">
          Clinical Directory
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Search and access AI clinical dossiers, history, and uploaded records for patients.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Search Input Control */}
      <div className="max-w-xl mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient registry by name or email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 placeholder-slate-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
          />
        </div>
      </div>

      {/* Patient Directory List */}
      <div>
        <h3 className="font-outfit font-bold text-lg text-slate-800 mb-4">
          Matched Patients ({patients.length})
        </h3>

        {patients.length === 0 && !loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <User className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No patients matched your search</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              Try searching with another key or verify spellings in the registry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handlePatientClick(patient.id)}
                className="bg-white border border-slate-200 hover:border-teal-400 rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer transition duration-150 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-outfit font-bold text-slate-800 text-base truncate">
                        {patient.name}
                      </h4>
                      <div className="flex items-center text-xs text-slate-400 mt-1 truncate">
                        <Mail className="h-3.5 w-3.5 mr-1 shrink-0" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 mt-1" />
                </div>
                <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>ID: #{patient.id}</span>
                  <span className="text-teal-600 font-bold hover:underline">View Dossier &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
