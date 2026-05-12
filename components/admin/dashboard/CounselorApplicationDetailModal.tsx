"use client";

import React from 'react';
import { X, Mail, Briefcase, GraduationCap, FileText, Image as ImageIcon, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface CounselorApplicationDetailModalProps {
  application: any;
  onClose: () => void;
  onApprove: (email: string) => void;
  onReject: (email: string) => void;
}

export default function CounselorApplicationDetailModal({ 
  application, 
  onClose, 
  onApprove, 
  onReject 
}: CounselorApplicationDetailModalProps) {
  const [showIdPhoto, setShowIdPhoto] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 text-orange-600 ring-orange-100';
      case 'approved':
        return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
      case 'rejected':
        return 'bg-rose-50 text-rose-600 ring-rose-100';
      default:
        return 'bg-zinc-50 text-zinc-600 ring-zinc-100';
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-600" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600 p-10 rounded-t-[3rem] text-white">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-black shrink-0 ring-4 ring-white/30">
                {application.full_name?.substring(0, 1) || "C"}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black mb-2">{application.full_name}</h2>
                <div className="flex items-center gap-2 text-indigo-100 mb-3">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-medium">{application.email}</span>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ring-2 ${getStatusColor(application.status)}`}>
                  {application.status === 'pending' && <Clock className="h-3 w-3" />}
                  {application.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                  {application.status === 'rejected' && <XCircle className="h-3 w-3" />}
                  {application.status}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-10 space-y-8">
            {/* Professional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
                  <GraduationCap className="h-4 w-4" />
                  Qualification
                </div>
                <p className="text-lg font-bold text-zinc-900">{application.qualification}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
                  <Briefcase className="h-4 w-4" />
                  Experience
                </div>
                <p className="text-lg font-bold text-zinc-900">{application.experience_years} Years</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
                  <Calendar className="h-4 w-4" />
                  Applied On
                </div>
                <p className="text-sm font-medium text-zinc-600">
                  {application.applied_at ? formatDate(application.applied_at) : 'N/A'}
                </p>
              </div>
            </div>

            {/* ID Photo */}
            {application.id_photo_url && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
                  <ImageIcon className="h-4 w-4" />
                  Professional ID Photo
                </div>
                <button
                  onClick={() => setShowIdPhoto(true)}
                  className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition-all group"
                >
                  <img
                    src={application.id_photo_url}
                    alt="ID Photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to enlarge
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Personal Statement */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
                <FileText className="h-4 w-4" />
                Personal Statement
              </div>
              <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
                  {application.personal_statement || 'No personal statement provided.'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {application.status === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-200">
                <button
                  onClick={() => {
                    onApprove(application.email);
                    onClose();
                  }}
                  className="flex-1 h-14 px-8 bg-zinc-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-zinc-200 active:scale-95 flex items-center justify-center gap-3"
                >
                  <CheckCircle className="h-5 w-5" />
                  Approve Application
                </button>
                <button
                  onClick={() => {
                    onReject(application.email);
                    onClose();
                  }}
                  className="flex-1 h-14 px-8 border-2 border-zinc-200 bg-white text-zinc-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <XCircle className="h-5 w-5" />
                  Reject Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ID Photo Lightbox */}
      {showIdPhoto && application.id_photo_url && (
        <div 
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowIdPhoto(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={application.id_photo_url} 
              alt="ID Photo" 
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setShowIdPhoto(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
