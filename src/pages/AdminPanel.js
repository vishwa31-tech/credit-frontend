import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import RoleRequestManagement from '../components/RoleRequestManagement';

export default function AdminPanel() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    adminService.getDashboard()
      .then(res => {
        setDashboard(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Unable to load admin dashboard');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-16">Loading admin dashboard...</div>;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition border-b-2 ${
                activeTab === 'overview'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('role-requests')}
              className={`px-6 py-3 font-semibold transition border-b-2 ${
                activeTab === 'role-requests'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Role Requests ({dashboard.counts.pendingRoleRequests || 0})
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-purple-600 text-white rounded-xl p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em]">Users</p>
                  <p className="text-4xl font-bold mt-3">{dashboard.counts.totalUsers}</p>
                </div>
                <div className="bg-green-600 text-white rounded-xl p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em]">Events</p>
                  <p className="text-4xl font-bold mt-3">{dashboard.counts.totalEvents}</p>
                </div>
                <div className="bg-blue-600 text-white rounded-xl p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em]">Jobs</p>
                  <p className="text-4xl font-bold mt-3">{dashboard.counts.totalJobs}</p>
                </div>
                <div className="bg-yellow-600 text-white rounded-xl p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em]">Registrations</p>
                  <p className="text-4xl font-bold mt-3">{dashboard.counts.totalRegistrations}</p>
                </div>
              </div>

              {/* Role Requests Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-600 text-white rounded-xl p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em]">Pending Requests</p>
                  <p className="text-4xl font-bold mt-3">{dashboard.counts.pendingRoleRequests || 0}</p>
                </div>
                <div className="bg-green-600 text-white rounded-xl p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em]">Approved</p>
                  <p className="text-4xl font-bold mt-3">{dashboard.counts.approvedRoleRequests || 0}</p>
                </div>
                <div className="bg-red-600 text-white rounded-xl p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em]">Rejected</p>
                  <p className="text-4xl font-bold mt-3">{dashboard.counts.rejectedRoleRequests || 0}</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Events</h2>
                  <div className="space-y-3">
                    {dashboard.events.map(event => (
                      <div key={event._id} className="p-4 border rounded-lg border-gray-200">
                        <p className="font-semibold text-gray-800">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.category} • {new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Organizer: {event.organizer?.name || 'Unknown'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Job Posts</h2>
                  <div className="space-y-3">
                    {dashboard.jobs.map(job => (
                      <div key={job._id} className="p-4 border rounded-lg border-gray-200">
                        <p className="font-semibold text-gray-800">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.company} • {job.jobType}</p>
                        <p className="text-sm text-gray-600">Apply: {job.applicationType}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Registrations</h2>
                <div className="space-y-3">
                  {dashboard.registrations.map(registration => (
                    <div key={registration._id} className="p-4 border rounded-lg border-gray-200">
                      <p className="font-semibold text-gray-800">{registration.user?.name || 'User'} registered for {registration.event?.title || 'event'}</p>
                      <p className="text-sm text-gray-600">
                        Tickets: {registration.ticketCount} • Section: {registration.section || 'N/A'}
                        {registration.specialty ? ` • Specialty: ${registration.specialty}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Role Requests Tab */}
          {activeTab === 'role-requests' && (
            <RoleRequestManagement />
          )}
        </div>
      </div>
    </div>
  );
}
