import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import doctorApi from '../api/doctorApi';
import documentApi from '../api/documentApi';
import SummaryCard from '../components/SummaryCard';
import TimelineList from '../components/TimelineList';
import DocumentList from '../components/DocumentList';
import { Pill, AlertTriangle, Activity, ArrowLeft, Shield, Mail, Calendar, User, RefreshCw, Loader2, Stethoscope } from 'lucide-react';

export const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfileAndDocs = async () => {
    try {
      setLoadingProfile(true);
      setLoadingDocs(true);
      setError(null);

      // Fetch Patient Profile details via Doctor API
      const profileData = await doctorApi.getPatient(id);
      setProfile(profileData);

      // Fetch Patient Document index
      const docsData = await documentApi.getDocuments(id);
      setDocuments(docsData || []);
    } catch (err) {
      console.error(err);
      setError('Could not access patient records. Please verify authority limits and server status.');
    } finally {
      setLoadingProfile(false);
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileAndDocs();
    }
  }, [id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfileAndDocs();
    setRefreshing(false);
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    try {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch (e) {
      return 'N/A';
    }
  };

  const getAllergySeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'SEVERE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MODERATE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  if (loadingProfile && !refreshing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-teal-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Retrieving patient dossier...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full text-left">
      {/* Header and Back navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition shadow-sm"
            title="Back to Directory"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-outfit font-extrabold text-3xl text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Patient Dossier</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-wider">
                Clinical View
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review history, documents, and diagnostics. Editing features are locked.
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Main Grid: Info card & AI summary card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-lg text-slate-800">
                  {profile?.name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                  ID: #{profile?.id}
                </span>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-slate-100 pt-4 text-slate-600">
              <div className="flex items-center text-sm font-medium">
                <Mail className="h-4.5 w-4.5 text-slate-400 mr-2.5 shrink-0" />
                <span className="truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center text-sm font-medium">
                <Calendar className="h-4.5 w-4.5 text-slate-400 mr-2.5 shrink-0" />
                <span>Born: {profile?.dob} ({calculateAge(profile?.dob)} yrs)</span>
              </div>
              <div className="flex items-center text-sm font-medium">
                <Shield className="h-4.5 w-4.5 text-slate-400 mr-2.5 shrink-0" />
                <span className="capitalize">{profile?.gender?.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Stethoscope className="h-4 w-4 text-teal-500" />
              <span>Dossier verified</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        {/* AI Summary Card (spans 2 columns) */}
        <div className="lg:col-span-2">
          <SummaryCard summary={profile?.aiSummary} loading={loadingProfile} />
        </div>
      </div>

      {/* Grid: Medications, Allergies, Diseases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Medications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Pill className="h-5 w-5 text-teal-600" />
              <h3 className="font-outfit font-bold text-slate-800">Active Medications</h3>
            </div>

            {profile?.medications?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No medications listed.</p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {profile?.medications?.map((med, idx) => (
                  <li key={idx} className="py-2">
                    <p className="text-sm font-semibold text-slate-700">{med.name}</p>
                    <p className="text-xs text-slate-400">
                      {med.dosage} • {med.frequency}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      Started: {med.startDate}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-outfit font-bold text-slate-800">Sensitivities / Allergies</h3>
            </div>

            {profile?.allergies?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No allergies listed.</p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {profile?.allergies?.map((allergy, idx) => (
                  <li key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{allergy.name}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${getAllergySeverityColor(allergy.severity)}`}>
                      {allergy.severity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-rose-500" />
              <h3 className="font-outfit font-bold text-slate-800">Chronic Conditions</h3>
            </div>

            {profile?.chronicDiseases?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No chronic conditions listed.</p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {profile?.chronicDiseases?.map((disease, idx) => (
                  <li key={idx} className="py-2.5">
                    <p className="text-sm font-semibold text-slate-700">{disease.name}</p>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      Diagnosed: {disease.diagnosedDate}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Documents & Timeline (Read-only) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Note that we pass readOnly={true} here to lock down delete features */}
          <DocumentList documents={documents} loading={loadingDocs} readOnly={true} />
        </div>
        <div>
          <TimelineList timeline={profile?.timeline} />
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
