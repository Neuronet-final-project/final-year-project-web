"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, RefreshCw, ChevronDown } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: '', label: 'All Role Tiers' },
  { value: 'adolescent', label: 'Adolescent' },
  { value: 'counselor', label: 'Counselor' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'admin', label: 'Admin' },
];

interface UserManagementProps {
  users: any[];
  userSearch: string;
  setUserSearch: (v: string) => void;
  userRoleFilter: string;
  setUserRoleFilter: (v: string) => void;
  usersLoading: boolean;
  loadUsers: () => void;
  handleToggleUserStatus: (email: string, status: boolean) => void;
}

export default function UserManagementTab({ 
  users, userSearch, setUserSearch, userRoleFilter, setUserRoleFilter, usersLoading, loadUsers, handleToggleUserStatus 
}: UserManagementProps) {
  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = ROLE_OPTIONS.find(o => o.value === userRoleFilter)?.label || 'All Role Tiers';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      {/* Search & Filter Header */}
      <div className="flex flex-col xl:flex-row gap-4 md:gap-5 items-stretch xl:items-center justify-between rounded-[2rem] md:rounded-[2.5rem] border border-indigo-100/50 bg-gradient-to-br from-indigo-50/40 via-white/70 to-violet-50/35 p-4 md:p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] backdrop-blur-md">
        <div className="relative w-full xl:w-[min(100%,420px)] xl:max-w-md group">
          <input 
            type="text" 
            placeholder="Search users by name or email…" 
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadUsers()}
            className="w-full bg-white/80 border border-indigo-100/70 rounded-xl px-10 py-2.5 text-[13px] font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300/50 transition-all shadow-sm" 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Custom compact dropdown — replaces native select to avoid full-screen iOS/Android picker */}
            <div className="relative flex-1 xl:flex-none" ref={roleRef}>
              <button
                onClick={() => setRoleOpen(prev => !prev)}
                className="w-full xl:w-auto flex items-center justify-between gap-3 bg-white/80 border border-indigo-100/70 rounded-xl px-5 py-2.5 text-[12px] font-black text-zinc-700 outline-none hover:bg-white transition-colors uppercase tracking-widest min-w-[180px] shadow-sm"
              >
                <span>{selectedLabel}</span>
                <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleOpen && (
                <div className="absolute left-0 top-full mt-2 w-full min-w-[200px] bg-white rounded-2xl shadow-2xl border border-indigo-100/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[min(70vh,22rem)] overflow-y-auto">
                  {ROLE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setUserRoleFilter(opt.value); setRoleOpen(false); void loadUsers(); }}
                      className={`w-full text-left px-5 py-3.5 text-xs font-black uppercase tracking-widest transition-colors ${
                        userRoleFilter === opt.value
                          ? 'bg-indigo-600 text-white'
                          : 'text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={loadUsers} className="flex-1 xl:flex-none min-h-[42px] h-11 xl:h-11 bg-zinc-900 text-white rounded-xl px-6 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-md shadow-indigo-900/10 hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
              Synchronize
            </button>
        </div>
      </div>


      {/* Main Table View */}
      <div className="overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-indigo-100/50 bg-gradient-to-br from-slate-50/90 via-indigo-50/25 to-violet-50/30 shadow-[0_8px_30px_rgba(79,70,229,0.07)] backdrop-blur-md min-h-[500px]">
        <div className="p-6 md:p-10 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Enterprise User Directory</h3>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Authorized entity registry</p>
            </div>
            <div className="px-4 py-2 bg-indigo-50 rounded-xl">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{users.length} Active Profiles</span>
            </div>
        </div>
        <div className="overflow-x-auto p-4 sm:p-10">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              <tr className="border-b border-zinc-100">
                <th className="pb-6 px-4">Entity Profile</th>
                <th className="pb-6 px-4">Classification</th>
                <th className="pb-6 px-4 hidden md:table-cell">Onboarding</th>
                <th className="pb-6 px-4 hidden md:table-cell">Status</th>
                <th className="pb-6 px-4 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {usersLoading ? (
                <tr><td colSpan={5} className="py-40 text-center text-sm font-black text-zinc-300 uppercase tracking-widest animate-pulse">Scanning Secure Vault...</td></tr>
              ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="py-40 text-center text-sm font-bold text-zinc-300 italic">No matching entities located in the primary database.</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 flex-shrink-0 bg-white rounded-2xl shadow-sm ring-1 ring-zinc-100 flex items-center justify-center font-black text-[11px] text-zinc-500 uppercase group-hover:scale-110 transition-transform">
                        {user.full_name?.substring(0, 2) || user.email.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-zinc-800 leading-none mb-2">{user.full_name || "Unidentified Unit"}</span>
                        <span className="text-[11px] font-medium text-zinc-400 truncate max-w-[120px] sm:max-w-none">{user.email}</span>
                        {/* Mobile-only inline status */}
                        <div className="flex items-center gap-1.5 mt-2 md:hidden">
                          <div className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${user.is_active ? 'text-emerald-700' : 'text-red-700'}`}>{user.is_active ? 'Active' : 'Restricted'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ring-1 ring-inset ${
                      user.role === 'admin' ? 'bg-zinc-900 text-white ring-zinc-800' :
                      user.role === 'counselor' ? 'bg-indigo-50 text-indigo-600 ring-indigo-200' :
                      user.role === 'adolescent' ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' :
                      user.role === 'guardian' ? 'bg-orange-50 text-orange-600 ring-orange-200' :
                      'bg-violet-50 text-violet-700 ring-violet-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-[11px] font-bold text-zinc-400 hidden md:table-cell">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Historical Record"}
                  </td>
                  <td className="py-6 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                       <div className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${user.is_active ? 'text-emerald-700' : 'text-red-700'}`}>{user.is_active ? 'Authorized' : 'Restricted'}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button 
                      onClick={() => handleToggleUserStatus(user.email, user.is_active)}
                      className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
                        user.is_active 
                          ? 'border-rose-100 bg-rose-50/50 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-lg hover:shadow-rose-100' 
                          : 'border-emerald-100 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-100'
                      }`}
                    >
                      {user.is_active ? <span className="hidden sm:inline">Revoke Session</span> : <span className="hidden sm:inline">Grant Session</span>}
                      {user.is_active ? <span className="sm:hidden">Revoke</span> : <span className="sm:hidden">Grant</span>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
