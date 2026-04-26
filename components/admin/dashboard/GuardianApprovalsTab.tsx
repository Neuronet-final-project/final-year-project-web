"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Approval {
  approval_id: string;
  adolescent_id: string;
  adolescent_name: string;
  counselor_email: string;
  counselor_name: string;
  guardian_emails: string[];
  request_reason: string;
  status: string;
  requested_by: string;
  requested_by_role: string;
  responded_by?: string;
  response_reason?: string;
  created_at: string;
  responded_at?: string;
  expires_at?: string;
}

export default function GuardianApprovalsTab() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/proxy/backend/guardian-approvals/admin/all-approvals');
      if (res.ok) {
        const data = await res.json();
        setApprovals(data);
      } else {
        toast.error('Failed to load approvals');
      }
    } catch (error) {
      toast.error('Error loading approvals');
    } finally {
      setLoading(false);
    }
  };

  const filteredApprovals = approvals.filter(a => 
    filter === 'all' || a.status === filter
  );

  const stats = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    denied: approvals.filter(a => a.status === 'denied').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'denied': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'revoked': return 'bg-zinc-50 text-zinc-700 border-zinc-200';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle2 className="h-4 w-4" />;
      case 'denied': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-xl">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Guardian Approval System</h3>
            <p className="text-[11px] font-bold text-zinc-400 capitalize">Monitor counselor communication requests</p>
          </div>
        </div>
        <button 
          onClick={fetchApprovals}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: stats.total, color: 'blue', icon: <ShieldCheck className="h-5 w-5" /> },
          { label: 'Pending', value: stats.pending, color: 'amber', icon: <Clock className="h-5 w-5" /> },
          { label: 'Approved', value: stats.approved, color: 'emerald', icon: <CheckCircle2 className="h-5 w-5" /> },
          { label: 'Denied', value: stats.denied, color: 'rose', icon: <XCircle className="h-5 w-5" /> },
        ].map((stat, i) => (
          <div key={i} className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className={`h-12 w-12 flex items-center justify-center rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-zinc-900">{stat.value}</p>
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white/40 border border-white/60 p-2 rounded-2xl backdrop-blur-md">
        {(['all', 'pending', 'approved', 'denied'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === f
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-zinc-500 hover:bg-white/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        {filteredApprovals.length === 0 ? (
          <div className="py-16 text-center">
            <Eye className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-400">No approval requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApprovals.map((approval) => (
              <div key={approval.approval_id} className="p-6 rounded-2xl border border-zinc-100 bg-white hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-sm font-black text-zinc-900">{approval.adolescent_name}</h4>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(approval.status)}`}>
                        {getStatusIcon(approval.status)}
                        {approval.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-3">
                      <span className="font-bold">Counselor:</span> {approval.counselor_name} ({approval.counselor_email})
                    </p>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      <span className="font-bold">Reason:</span> {approval.request_reason}
                    </p>
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    <p className="font-bold">Requested by</p>
                    <p>{approval.requested_by_role}</p>
                    <p className="mt-2">{new Date(approval.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {approval.responded_at && (
                  <div className="pt-4 border-t border-zinc-100">
                    <p className="text-xs text-zinc-500">
                      <span className="font-bold">Response:</span> {approval.response_reason || 'No reason provided'}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Responded at: {new Date(approval.responded_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
