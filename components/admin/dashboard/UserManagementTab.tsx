"use client";

import React from 'react';
import { Search, RefreshCw, ShieldCheck } from 'lucide-react';

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
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      {/* Search & Filter Header */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between rounded-[2.5rem] border border-white/40 bg-white/60 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="relative w-full xl:w-[500px] group">
          <input 
            type="text" 
            placeholder="Search users by name, email, or unique identifier..." 
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadUsers()}
            className="w-full bg-zinc-100/50 border border-zinc-200/50 rounded-2xl px-12 py-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-indigo-600/10 focus:bg-white focus:border-indigo-600/20 transition-all" 
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            <select 
              value={userRoleFilter} 
              onChange={e => setUserRoleFilter(e.target.value)}
              className="flex-1 xl:flex-none bg-zinc-100/50 border border-zinc-200/50 rounded-2xl px-8 py-4 text-[13px] font-black text-zinc-700 outline-none hover:bg-zinc-200/50 transition-colors appearance-none text-center uppercase tracking-widest"
            >
              <option value="">All Role Tiers</option>
              <option value="adolescent">Adolescent</option>
              <option value="counselor">Counselor</option>
              <option value="guardian">Guardian</option>
              <option value="admin">Administrator</option>
            </select>
            <button onClick={loadUsers} className="flex-1 xl:flex-none h-14 bg-zinc-900 text-white rounded-2xl px-8 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-zinc-200 hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
              Synchronize
            </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-hidden rounded-[3rem] border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md min-h-[500px]">
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
                      'bg-orange-50 text-orange-600 ring-orange-200'
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
