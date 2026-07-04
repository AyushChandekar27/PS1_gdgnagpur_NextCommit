import React, { useState } from 'react';
import { FileText, Calendar, Trash2, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import documentApi from '../api/documentApi';

export const DocumentList = ({ documents = [], loading = false, onDeleteSuccess, readOnly = false }) => {
  const [deletingId, setDeletingId] = useState(null);

  const getBadgeColor = (type) => {
    switch (type) {
      case 'LAB_REPORT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PRESCRIPTION':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DISCHARGE_SUMMARY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SCAN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatType = (type) => {
    return type?.replace(/_/g, ' ') || 'UNKNOWN';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    setDeletingId(id);
    try {
      await documentApi.deleteDocument(id);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete document. Please check connection and authentication.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-2" />
        <p className="text-sm font-medium text-slate-500">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-outfit font-bold text-lg text-slate-800 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-teal-600" />
          <span>Patient Documents</span>
        </h3>
        <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-100">
          {documents.length} Total
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="p-8 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No documents found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">
            {readOnly 
              ? 'No documents have been uploaded to this patient profile.' 
              : 'Upload prescriptions, scans, or lab reports to populate this panel.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-bold tracking-wider">
                <th className="px-6 py-3">Document Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Uploaded Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700 text-sm">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px]" title={doc.fileName || doc.name}>
                        {doc.fileName || doc.name || 'document'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColor(doc.type)}`}>
                      {formatType(doc.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(doc.uploadDate || doc.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {/* Let's open the API endpoint to file in a new tab if supported, or fallback */}
                      <a
                        href={doc.fileUrl || `/api/documents/file/${doc.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition"
                        title="Open Document"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      {!readOnly && (
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deletingId === doc.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete Document"
                        >
                          {deletingId === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
