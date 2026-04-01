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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadUsers()}
            className="w-full bg-zinc-100 border-none rounded-2xl px-12 py-3.5 text-sm font-semibold outline-none focus:ring-4 focus:ring-purple-100 transition-all" 
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-purple-600" />
        </div>
        <div className="flex items-center gap-3">
            <select 
              value={userRoleFilter} 
              onChange={e => setUserRoleFilter(e.target.value)}
              className="bg-zinc-100 border-none rounded-2xl px-6 py-3.5 text-sm font-bold text-zinc-700 outline-none hover:bg-zinc-200 transition-colors appearance-none"
            >
              <option value="">All Roles</option>
              <option value="adolescent">Adolescents</option>
              <option value="counselor">Counselors</option>
              <option value="guardian">Guardians</option>
              <option value="admin">Admins</option>
            </select>
            <button onClick={loadUsers} className="bg-purple-600 text-white rounded-2xl px-6 py-3.5 flex items-center gap-2 font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all active:scale-95">
              <RefreshCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
              Sync Database
            </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-zinc-100 rounded-[3rem] shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-8 border-b border-zinc-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-zinc-900">User Directory</h3>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{users.length} Records Found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <tr>
                <th className="px-8 py-5">User Profile</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Registration</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {usersLoading ? (
                <tr><td colSpan={5} className="py-32 text-center text-zinc-400 font-medium animate-pulse">Retrieving system accounts...</td></tr>
              ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="py-32 text-center text-zinc-400 font-medium">No system users match your search criteria.</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="group hover:bg-purple-50/20 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center font-bold text-xs text-purple-600 uppercase">
                        {user.full_name?.substring(0, 2) || user.email.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 leading-none mb-1.5">{user.full_name || "Self-Registered User"}</p>
                        <p className="text-xs font-semibold text-zinc-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-zinc-900 text-white' :
                      user.role === 'counselor' ? 'bg-indigo-100 text-indigo-700 font-bold' :
                      user.role === 'adolescent' ? 'bg-emerald-100 text-emerald-700 font-bold' :
                      'bg-amber-100 text-amber-700 font-bold'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-zinc-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Prior to Activation"}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <div className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                       <span className="text-xs font-black uppercase tracking-tighter text-zinc-700">{user.is_active ? 'Authenticated' : 'Suspended'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleToggleUserStatus(user.email, user.is_active)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all active:scale-95 ${
                        user.is_active 
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-100' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-100'
                      }`}
                    >
                      {user.is_active ? 'Revoke Access' : 'Restore Access'}
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
