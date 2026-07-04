import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import patientApi from '../api/patientApi';
import documentApi from '../api/documentApi';
import SummaryCard from '../components/SummaryCard';
import TimelineList from '../components/TimelineList';
import DocumentUpload from '../components/DocumentUpload';
import DocumentList from '../components/DocumentList';
import MedicationForm from '../components/MedicationForm';
import AllergyForm from '../components/AllergyForm';
import ChronicDiseaseForm from '../components/ChronicDiseaseForm';
import { Pill, AlertTriangle, Activity, Plus, Shield, Mail, Calendar, User, RefreshCw, Loader2 } from 'lucide-react';

export const PatientDashboard = () => {
  const { userId } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modal display states
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showChronicModal, setShowChronicModal] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const data = await patientApi.getProfile(userId);
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not fetch patient profile details.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const docs = await documentApi.getDocuments(userId);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchDocuments();
    }
  }, [userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(), fetchDocuments()]);
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
        <p className="text-sm font-medium text-slate-500">Loading your profile dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full text-left">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-outfit font-extrabold text-3xl text-slate-900 tracking-tight">
            Patient Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review your medical history, uploads, and AI-compiled summaries.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
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
        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-lg text-slate-800">
                  {profile?.name || 'Patient'}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                  ID: #{profile?.id}
                </span>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-slate-100 pt-4">
              <div className="flex items-center text-sm font-medium text-slate-600">
                <Mail className="h-4.5 w-4.5 text-slate-400 mr-2.5 shrink-0" />
                <span className="truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center text-sm font-medium text-slate-600">
                <Calendar className="h-4.5 w-4.5 text-slate-400 mr-2.5 shrink-0" />
                <span>Born: {profile?.dob} ({calculateAge(profile?.dob)} yrs)</span>
              </div>
              <div className="flex items-center text-sm font-medium text-slate-600">
                <Shield className="h-4.5 w-4.5 text-slate-400 mr-2.5 shrink-0" />
                <span className="capitalize">{profile?.gender?.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>HealthBridge Secure Connection</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        {/* AI Summary Card (spans 2 columns on large screens) */}
        <div className="lg:col-span-2">
          <SummaryCard summary={profile?.aiSummary} loading={loadingProfile} />
        </div>
      </div>

      {/* Grid: Medications, Allergies, Diseases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Medications Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Pill className="h-5 w-5 text-teal-600" />
                <h3 className="font-outfit font-bold text-slate-800">Medications</h3>
              </div>
              <button
                onClick={() => setShowMedicationModal(true)}
                className="p-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
                title="Add Medication"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>

            {profile?.medications?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No medications listed.</p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {profile?.medications?.map((med, idx) => (
                  <li key={idx} className="py-2 text-left">
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

        {/* Allergies Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-outfit font-bold text-slate-800">Allergies</h3>
              </div>
              <button
                onClick={() => setShowAllergyModal(true)}
                className="p-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
                title="Add Allergy"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>

            {profile?.allergies?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No allergies listed.</p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {profile?.allergies?.map((allergy, idx) => (
                  <li key={idx} className="py-2.5 flex items-center justify-between text-left">
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

        {/* Chronic Diseases Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-rose-500" />
                <h3 className="font-outfit font-bold text-slate-800">Conditions</h3>
              </div>
              <button
                onClick={() => setShowChronicModal(true)}
                className="p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                title="Add Condition"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>

            {profile?.chronicDiseases?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No chronic conditions listed.</p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {profile?.chronicDiseases?.map((disease, idx) => (
                  <li key={idx} className="py-2.5 text-left">
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

      {/* Bottom Section: Upload / Documents + History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & List Column */}
        <div className="lg:col-span-2 space-y-6">
          <DocumentUpload patientId={userId} onUploadSuccess={handleRefresh} />
          <DocumentList documents={documents} loading={loadingDocs} onDeleteSuccess={handleRefresh} />
        </div>

        {/* Timeline Column */}
        <div>
          <TimelineList timeline={profile?.timeline} />
        </div>
      </div>

      {/* Modal Overlay Forms */}
      {showMedicationModal && (
        <MedicationForm
          patientId={userId}
          onClose={() => setShowMedicationModal(false)}
          onSubmitSuccess={fetchProfile}
        />
      )}

      {showAllergyModal && (
        <AllergyForm
          patientId={userId}
          onClose={() => setShowAllergyModal(false)}
          onSubmitSuccess={fetchProfile}
        />
      )}

      {showChronicModal && (
        <ChronicDiseaseForm
          patientId={userId}
          onClose={() => setShowChronicModal(false)}
          onSubmitSuccess={fetchProfile}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
