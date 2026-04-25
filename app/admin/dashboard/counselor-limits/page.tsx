'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface CounselorWorkload {
  counselor_email: string;
  counselor_name: string;
  current_assignments: number;
  max_assignments: number;
  utilization_percentage: number;
  is_at_capacity: boolean;
}

export default function CounselorLimitsPage() {
  const [workloads, setWorkloads] = useState<CounselorWorkload[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxLimit, setMaxLimit] = useState(20);

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const fetchWorkloads = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/counselor-assignments/workloads`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setWorkloads(data.workloads || []);
      }
    } catch (error) {
      toast.error('Failed to load counselor workloads');
    } finally {
      setLoading(false);
    }
  };

  const updateLimit = async (email: string, newLimit: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/counselor-assignments/limits/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ max_assignments: newLimit }),
      });

      if (response.ok) {
        toast.success('Limit updated successfully');
        fetchWorkloads();
      } else {
        toast.error('Failed to update limit');
      }
    } catch (error) {
      toast.error('Error updating limit');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Counselor Assignment Limits</h1>
        <p className="text-gray-600 mt-2">Manage workload limits for counselors</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Counselors</div>
          <div className="text-3xl font-bold text-gray-900">{workloads.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">At Capacity</div>
          <div className="text-3xl font-bold text-red-600">
            {workloads.filter(w => w.is_at_capacity).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Assignments</div>
          <div className="text-3xl font-bold text-blue-600">
            {workloads.reduce((sum, w) => sum + w.current_assignments, 0)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Avg Utilization</div>
          <div className="text-3xl font-bold text-green-600">
            {workloads.length > 0
              ? Math.round(workloads.reduce((sum, w) => sum + w.utilization_percentage, 0) / workloads.length)
              : 0}%
          </div>
        </div>
      </div>

      {/* Counselor List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Counselor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current / Max
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workloads.map((workload) => (
              <tr key={workload.counselor_email}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{workload.counselor_name}</div>
                  <div className="text-sm text-gray-500">{workload.counselor_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {workload.current_assignments} / {workload.max_assignments}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          workload.utilization_percentage >= 90
                            ? 'bg-red-600'
                            : workload.utilization_percentage >= 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(workload.utilization_percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700">{workload.utilization_percentage}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {workload.is_at_capacity ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      At Capacity
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    defaultValue={workload.max_assignments}
                    onBlur={(e) => {
                      const newLimit = parseInt(e.target.value);
                      if (newLimit !== workload.max_assignments && newLimit > 0) {
                        updateLimit(workload.counselor_email, newLimit);
                      }
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
