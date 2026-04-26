"use client";

import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, Clock, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BackgroundTask {
  task_id: string;
  task_type: string;
  status: string;
  adolescent_id?: string;
  adolescent_name?: string;
  result?: any;
  error_message?: string;
  created_at: string;
  completed_at?: string;
  execution_time_seconds?: number;
}

export default function BackgroundTasksTab() {
  const [tasks, setTasks] = useState<BackgroundTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/proxy/backend/background-tasks/admin/all-tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        const errorText = await res.text();
        console.error('Failed to load background tasks:', errorText);
        toast.error('Failed to load background tasks');
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  const retryTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/proxy/backend/background-tasks/admin/retry/${taskId}`, {
        method: 'POST',
      });
      if (res.ok) {
        toast.success('Task retry initiated');
        fetchTasks();
      } else {
        toast.error('Failed to retry task');
      }
    } catch (error) {
      toast.error('Error retrying task');
    }
  };

  const filteredTasks = tasks.filter(t => 
    filter === 'all' || t.status === filter
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'failed': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading && tasks.length === 0) {
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
          <div className="h-10 w-10 flex items-center justify-center bg-orange-600 text-white rounded-xl">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Background Task Monitor</h3>
            <p className="text-[11px] font-bold text-zinc-400 capitalize">Track async operations and processing</p>
          </div>
        </div>
        <button 
          onClick={fetchTasks}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-100 active:scale-95 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', value: stats.total, color: 'orange', icon: <Activity className="h-5 w-5" /> },
          { label: 'Pending', value: stats.pending, color: 'amber', icon: <Clock className="h-5 w-5" /> },
          { label: 'Completed', value: stats.completed, color: 'emerald', icon: <CheckCircle2 className="h-5 w-5" /> },
          { label: 'Failed', value: stats.failed, color: 'rose', icon: <XCircle className="h-5 w-5" /> },
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
        {(['all', 'pending', 'completed', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === f
                ? 'bg-orange-600 text-white shadow-lg'
                : 'text-zinc-500 hover:bg-white/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center">
            <Zap className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-400">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.task_id} className="p-6 rounded-2xl border border-zinc-100 bg-white hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>
                      <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-zinc-50 text-zinc-700 border border-zinc-200">
                        {task.task_type}
                      </span>
                    </div>
                    {task.adolescent_name && (
                      <p className="text-xs text-zinc-600 mb-2">
                        <span className="font-bold">Adolescent:</span> {task.adolescent_name}
                      </p>
                    )}
                    {task.error_message && (
                      <p className="text-xs text-rose-600 mt-2">
                        <span className="font-bold">Error:</span> {task.error_message}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    <p className="font-bold">Created</p>
                    <p>{new Date(task.created_at).toLocaleString()}</p>
                    {task.completed_at && (
                      <>
                        <p className="font-bold mt-2">Completed</p>
                        <p>{new Date(task.completed_at).toLocaleString()}</p>
                      </>
                    )}
                    {task.execution_time_seconds && (
                      <p className="mt-2 text-emerald-600 font-bold">
                        {task.execution_time_seconds.toFixed(2)}s
                      </p>
                    )}
                  </div>
                </div>
                
                {task.status === 'failed' && (
                  <div className="pt-4 border-t border-zinc-100">
                    <button
                      onClick={() => retryTask(task.task_id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-orange-600 text-white hover:bg-orange-700 active:scale-95 transition-all"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Retry Task
                    </button>
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
