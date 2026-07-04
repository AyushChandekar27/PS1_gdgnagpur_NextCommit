import React, { useState } from 'react';
import { Activity, Pill, FileText, Calendar, ChevronDown, ChevronUp, Stethoscope, Heart } from 'lucide-react';

export const TimelineList = ({ timeline = [] }) => {
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getEventIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'DIAGNOSIS':
        return <Activity className="h-5 w-5 text-teal-600" />;
      case 'SURGERY':
        return <Heart className="h-5 w-5 text-rose-600" />;
      case 'PRESCRIPTION':
        return <Pill className="h-5 w-5 text-blue-600" />;
      case 'LAB_REPORT':
        return <FileText className="h-5 w-5 text-amber-600" />;
      default:
        return <Stethoscope className="h-5 w-5 text-slate-600" />;
    }
  };

  const getEventBg = (type) => {
    switch (type?.toUpperCase()) {
      case 'DIAGNOSIS':
        return 'bg-teal-50 border-teal-200';
      case 'SURGERY':
        return 'bg-rose-50 border-rose-200';
      case 'PRESCRIPTION':
        return 'bg-blue-50 border-blue-200';
      case 'LAB_REPORT':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const sortedTimeline = [...timeline].sort((a, b) => {
    const dateA = new Date(a.date || a.timestamp || 0);
    const dateB = new Date(b.date || b.timestamp || 0);
    return dateB - dateA; // Newest first
  });

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition hover:shadow-md text-left">
      <h3 className="font-outfit font-bold text-lg text-slate-800 mb-6 flex items-center space-x-2">
        <Activity className="h-5 w-5 text-teal-600" />
        <span>Medical History Timeline</span>
      </h3>

      {sortedTimeline.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Timeline is empty</p>
          <p className="text-xs text-slate-400 mt-1">No medical history entries recorded for this patient.</p>
        </div>
      ) : (
        <div className="relative border-l border-slate-200 ml-4.5 pl-6 space-y-6">
          {sortedTimeline.map((event, idx) => {
            const eventId = event.id || idx;
            const isExpanded = expandedIds.has(eventId);
            return (
              <div key={eventId} className="relative group">
                {/* Marker Dot (absolute positioned on the timeline line) */}
                <div className={`absolute -left-10.5 top-1.5 flex h-8.5 w-8.5 items-center justify-center rounded-full border-2 bg-white transition duration-200 group-hover:scale-105 ${getEventBg(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>

                {/* Event Card */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 transition duration-200 hover:bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{event.title || event.event}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          {event.type}
                        </span>
                        <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                        <span className="text-xs font-semibold text-slate-500">
                          {formatDate(event.date || event.timestamp)}
                        </span>
                      </div>
                    </div>
                    {event.description && (
                      <button
                        onClick={() => toggleExpand(eventId)}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                      >
                        {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                      </button>
                    )}
                  </div>

                  {event.description && isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed transition-all duration-200">
                      {event.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimelineList;
