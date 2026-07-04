import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import documentApi from '../api/documentApi';

export const DocumentUpload = ({ patientId, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [type, setType] = useState('LAB_REPORT');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null); // { text, type: 'success' | 'error' }
  const fileInputRef = useRef(null);

  const documentTypes = [
    { value: 'LAB_REPORT', label: 'Lab Report' },
    { value: 'PRESCRIPTION', label: 'Prescription' },
    { value: 'DISCHARGE_SUMMARY', label: 'Discharge Summary' },
    { value: 'SCAN', label: 'Medical Scan (X-Ray, MRI, etc.)' },
    { value: 'OTHER', label: 'Other Document' },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      showToast('Only PDFs and image files (JPEG, PNG, GIF, WebP) are allowed.', 'error');
      return;
    }
    setFile(selectedFile);
    setMessage(null);
  };

  const showToast = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setProgress(15);
    
    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 15;
        });
      }, 150);

      await documentApi.upload(patientId, file, type);
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        showToast('Document uploaded successfully!', 'success');
        setFile(null);
        setUploading(false);
        setProgress(0);
        if (onUploadSuccess) onUploadSuccess();
      }, 300);

    } catch (err) {
      setUploading(false);
      setProgress(0);
      showToast(err.response?.data?.message || 'Failed to upload document. Please check the backend connection.', 'error');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div id="upload-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition duration-200 hover:shadow-md">
      <h3 className="font-outfit font-bold text-lg text-slate-800 mb-4 flex items-center space-x-2">
        <Upload className="h-5 w-5 text-teal-600" />
        <span>Upload Medical Document</span>
      </h3>

      {message && (
        <div className={`mb-4 flex items-start space-x-2.5 p-3.5 rounded-xl border text-sm transition-all duration-300 ${
          message.type === 'success' 
            ? 'bg-teal-50 border-teal-200 text-teal-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Document Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Document Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={uploading}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100 disabled:opacity-60"
          >
            {documentTypes.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition duration-200 cursor-pointer ${
            dragActive 
              ? 'border-teal-500 bg-teal-50/50' 
              : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50/50'
          }`}
          onClick={file ? undefined : triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/*"
            onChange={handleChange}
            disabled={uploading}
            className="hidden"
          />

          {file ? (
            <div className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <div className="flex items-center space-x-3 truncate">
                <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="truncate text-left">
                  <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Drag and drop your file here, or <span className="text-teal-600 hover:underline">browse</span>
              </p>
              <p className="text-xs text-slate-400">
                Supports PDF, JPG, PNG, GIF, WebP up to 10MB
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Uploading document...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {file && !uploading && (
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition duration-150 flex items-center justify-center space-x-2 shadow-sm shadow-teal-100"
          >
            <span>Upload Document</span>
          </button>
        )}

        {uploading && (
          <button
            type="button"
            disabled
            className="w-full bg-teal-600/50 text-white font-semibold py-2.5 rounded-xl transition cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </button>
        )}
      </form>
    </div>
  );
};

export default DocumentUpload;
