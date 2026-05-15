'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Users, TrendingUp, AlertCircle, CheckCircle2, RefreshCw, X, ChevronRight } from 'lucide-react';

interface CounselorWorkload {
  counselor_email: string;
  counselor_name: string;
  current_assignments: number;
  max_assignments: number;
  utilization_percentage: number;
  is_at_capacity: boolean;
}

interface CounselorAssignmentRow {
  assignment_id: string;
  adolescent_id: string;
  adolescent_name?: string | null;
  adolescent_email?: string | null;
  assigned_by?: string | null;
  assignment_reason?: string | null;
  created_at?: string;
}

export default function CounselorLimitsTab() {
  const [workloads, setWorkloads] = useState<CounselorWorkload[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignPanel, setAssignPanel] = useState<{ email: string; name: string } | null>(null);
  const [assignments, setAssignments] = useState<CounselorAssignmentRow[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const fetchWorkloads = async () => {
    try {
      const response = await fetch('/api/proxy/backend/counselor-assignments/workloads');
      if (response.ok) {
        const data = await response.json();
        setWorkloads(data.workloads || []);
      } else {
        toast.error('Failed to load counselor workloads');
      }
    } catch {
      toast.error('Failed to load counselor workloads');
    } finally {
      setLoading(false);
    }
  };

  const openAssignments = async (counselorEmail: string, counselorName: string) => {
    setAssignPanel({ email: counselorEmail, name: counselorName });
    setAssignLoading(true);
    setAssignments([]);
    try {
      const qs = new URLSearchParams({ email: counselorEmail });
      const response = await fetch(
        `/api/proxy/backend/counselor-assignments/for-counselor?${qs.toString()}`,
      );
      if (response.ok) {
        const data = (await response.json()) as CounselorAssignmentRow[];
        setAssignments(Array.isArray(data) ? data : []);
      } else {
        toast.error('Could not load assigned adolescents');
        setAssignments([]);
      }
    } catch {
      toast.error('Could not load assigned adolescents');
      setAssignments([]);
    } finally {
      setAssignLoading(false);
    }
  };

  const updateLimit = async (email: string, newLimit: number) => {
    try {
      const response = await fetch(`/api/proxy/backend/counselor-assignments/limits/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ max_assignments: newLimit }),
      });

      if (response.ok) {
        toast.success('Limit updated successfully');
        fetchWorkloads();
      } else {
        toast.error('Failed to update limit');
      }
    } catch {
      toast.error('Error updating limit');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = {
    total: workloads.length,
    atCapacity: workloads.filter(w => w.is_at_capacity).length,
    totalAssignments: workloads.reduce((sum, w) => sum + w.current_assignments, 0),
    avgUtilization: workloads.length > 0
      ? Math.round(workloads.reduce((sum, w) => sum + w.utilization_percentage, 0) / workloads.length)
      : 0
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-zinc-900 tracking-tight">Counselor Assignment Limits</h1>
            <p className="text-[11px] font-bold text-zinc-400 capitalize">Manage workload limits and capacity</p>
          </div>
        </div>
        <button 
          onClick={fetchWorkloads}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Counselors', value: stats.total, color: 'indigo', icon: <Users className="h-5 w-5" /> },
          { label: 'At Capacity', value: stats.atCapacity, color: 'rose', icon: <AlertCircle className="h-5 w-5" /> },
          { label: 'Total Assignments', value: stats.totalAssignments, color: 'blue', icon: <CheckCircle2 className="h-5 w-5" /> },
          { label: 'Avg Utilization', value: `${stats.avgUtilization}%`, color: 'emerald', icon: <TrendingUp className="h-5 w-5" /> },
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

      {/* Counselor List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Counselor
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Assignments
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Utilization
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Max Limit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {workloads.map((workload) => (
                <tr key={workload.counselor_email} className="hover:bg-white/50 transition-colors">
                  <td className="px-8 py-5">
                    <div>
                      <button
                        type="button"
                        onClick={() => openAssignments(workload.counselor_email, workload.counselor_name)}
                        className="group/name text-left"
                      >
                        <span className="text-sm font-black text-indigo-700 group-hover/name:text-indigo-900 group-hover/name:underline underline-offset-2 inline-flex items-center gap-1">
                          {workload.counselor_name}
                          <ChevronRight className="h-3.5 w-3.5 opacity-60 group-hover/name:opacity-100" />
                        </span>
                      </button>
                      <div className="text-xs text-zinc-500 mt-0.5">{workload.counselor_email}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-zinc-900">
                      {workload.current_assignments} / {workload.max_assignments}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px] bg-zinc-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            workload.utilization_percentage >= 90
                              ? 'bg-rose-600'
                              : workload.utilization_percentage >= 70
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(workload.utilization_percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-zinc-700 min-w-[40px]">
                        {workload.utilization_percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {workload.is_at_capacity ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="h-3 w-3" />
                        At Capacity
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Available
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      defaultValue={workload.max_assignments}
                      onBlur={(e) => {
                        const newLimit = parseInt(e.target.value, 10);
                        if (newLimit !== workload.max_assignments && newLimit > 0) {
                          updateLimit(workload.counselor_email, newLimit);
                        }
                      }}
                      className="w-20 px-3 py-2 border border-zinc-200 rounded-xl text-center font-black text-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {workloads.length === 0 && (
          <div className="py-16 text-center">
            <Users className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-400">No counselors found</p>
          </div>
        )}
      </div>

      {/* Assigned adolescents overlay */}
      {assignPanel && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-zinc-900/50 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assign-panel-title"
          onClick={() => setAssignPanel(null)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-5 border-b border-zinc-100 bg-gradient-to-r from-indigo-50 to-violet-50">
              <div className="min-w-0">
                <h2 id="assign-panel-title" className="text-sm font-black text-zinc-900 tracking-tight truncate">
                  Assigned adolescents
                </h2>
                <p className="text-xs font-bold text-indigo-600 mt-1 truncate">{assignPanel.name}</p>
                <p className="text-[11px] text-zinc-500 truncate">{assignPanel.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setAssignPanel(null)}
                className="shrink-0 p-2 rounded-xl text-zinc-500 hover:bg-white hover:text-zinc-900 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {assignLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-10 w-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : assignments.length === 0 ? (
                <p className="text-center text-sm font-bold text-zinc-400 py-10">No active assignments for this counselor.</p>
              ) : (
                <ul className="space-y-2">
                  {assignments.map((a) => (
                    <li
                      key={a.assignment_id}
                      className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3"
                    >
                      <p className="text-sm font-black text-zinc-900">
                        {a.adolescent_name?.trim() || 'Unnamed adolescent'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5 break-all">{a.adolescent_email || '—'}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
