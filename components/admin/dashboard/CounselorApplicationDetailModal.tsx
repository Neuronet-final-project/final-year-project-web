"use client";

import React from 'react';
import { X, Mail, Briefcase, GraduationCap, FileText, Image as ImageIcon, Calendar, CheckCircle, XCircle, Clock, Award, User } from 'lucide-react';

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

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    // Store original styles
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;
    
    // Find and lock the main content area
    const mainElement = document.querySelector('main');
    const originalMainStyle = mainElement ? window.getComputedStyle(mainElement).overflow : '';
    
    // Prevent scrolling on all levels
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (mainElement) {
      (mainElement as HTMLElement).style.overflow = 'hidden';
    }
    
    return () => {
      // Restore original styles
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = originalHtmlStyle;
      if (mainElement) {
        (mainElement as HTMLElement).style.overflow = originalMainStyle;
      }
    };
  }, []);

  // Debug logging
  React.useEffect(() => {
    console.log('Application data:', application);
  }, [application]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-gradient-to-r from-orange-500 to-amber-500',
          text: 'text-white',
          icon: Clock,
          label: 'Pending Review'
        };
      case 'approved':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
          text: 'text-white',
          icon: CheckCircle,
          label: 'Approved'
        };
      case 'rejected':
        return {
          bg: 'bg-gradient-to-r from-rose-500 to-red-500',
          text: 'text-white',
          icon: XCircle,
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-zinc-500 to-gray-500',
          text: 'text-white',
          icon: Clock,
          label: status
        };
    }
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-300"
        onClick={onClose}
      >
        <div 
          className="relative w-full h-full max-w-5xl bg-white shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Fixed positioning with dark background */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-6 right-6 z-[60] p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white transition-all shadow-2xl hover:shadow-xl active:scale-95 border-2 border-white/20"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header Section */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 rounded-t-[2.5rem] overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-32 w-32 rounded-[2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center text-5xl font-black text-white ring-4 ring-white/40 shadow-2xl">
                  {(application.full_name || application.fullName || application.name || 'C').substring(0, 1).toUpperCase()}
                </div>
                <div className={`absolute -bottom-3 -right-3 ${statusConfig.bg} ${statusConfig.text} px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight break-words">
                  {application.full_name || application.fullName || application.name || 'Unknown Applicant'}
                </h2>
                <div className="flex flex-col gap-3 text-white/90">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl w-fit">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-semibold break-all">{application.email || 'No email'}</span>
                  </div>
                  {application.applied_at && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl w-fit">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {formatDate(application.applied_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-12 space-y-10">
            {/* Professional Credentials */}
            <div>
              <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-indigo-600" />
                </div>
                Professional Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Qualification Card */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-zinc-100 bg-gradient-to-br from-white to-zinc-50 p-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <GraduationCap className="h-6 w-6 text-indigo-600" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Qualification</span>
                    </div>
                    <p className="text-2xl font-black text-zinc-900">{application.qualification || 'Not specified'}</p>
                  </div>
                </div>

                {/* Experience Card */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-zinc-100 bg-gradient-to-br from-white to-zinc-50 p-6 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Briefcase className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Experience</span>
                    </div>
                    <p className="text-2xl font-black text-zinc-900">{application.experience_years || application.experienceYears || 0} Years</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ID Photo Section */}
            {application.id_photo_url && (
              <div>
                <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-cyan-600" />
                  </div>
                  Professional ID Verification
                </h3>
                <div className="relative group">
                  <button
                    onClick={() => setShowIdPhoto(true)}
                    className="relative w-full md:w-80 h-80 rounded-2xl overflow-hidden border-4 border-zinc-200 hover:border-indigo-400 transition-all shadow-lg hover:shadow-2xl"
                  >
                    <img
                      src={application.id_photo_url}
                      alt="Professional ID"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                      <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-black text-zinc-900">Click to View Full Size</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Personal Statement */}
            <div>
              <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-pink-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-pink-600" />
                </div>
                Personal Statement
              </h3>
              <div className="relative rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 shadow-inner">
                <div className="absolute top-4 left-4 text-6xl text-indigo-100 font-serif">"</div>
                <div className="absolute bottom-4 right-4 text-6xl text-indigo-100 font-serif rotate-180">"</div>
                <p className="relative text-base leading-relaxed text-zinc-700 whitespace-pre-wrap font-medium">
                  {application.personal_statement || application.personalStatement || 'No personal statement provided.'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {application.status === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-zinc-100">
                <button
                  onClick={() => {
                    onApprove(application.email);
                    onClose();
                  }}
                  className="flex-1 group relative overflow-hidden h-16 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <CheckCircle className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">Approve Application</span>
                </button>
                <button
                  onClick={() => {
                    onReject(application.email);
                    onClose();
                  }}
                  className="flex-1 group relative overflow-hidden h-16 px-8 border-2 border-zinc-300 bg-white text-zinc-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Reject Application</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ID Photo Lightbox */}
      {showIdPhoto && application.id_photo_url && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowIdPhoto(false)}
        >
          <div className="relative max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <img 
              src={application.id_photo_url} 
              alt="Professional ID" 
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setShowIdPhoto(false)}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl p-4 transition-all shadow-2xl hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-sm font-bold">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
