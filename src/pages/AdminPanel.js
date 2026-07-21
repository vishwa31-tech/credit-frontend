import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import RoleRequestManagement from '../components/RoleRequestManagement';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [serviceLeads, setServiceLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [panelMessage, setPanelMessage] = useState({ type: '', text: '' });

  const loadDashboard = () => {
    setLoading(true);
    setError('');
    return Promise.all([
      adminService.getDashboard(),
      adminService.getServiceLeads(),
    ])
      .then(([dashboardRes, leadsRes]) => {
        setDashboard(dashboardRes.data);
        setServiceLeads(leadsRes.data || []);
        setPanelMessage({ type: '', text: '' });
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Unable to load admin dashboard');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!localStorage.getItem('token') || user?.role !== 'admin') {
      navigate('/admin-login');
      return;
    }

    loadDashboard();
  }, [navigate]);

  if (loading) return <div className="text-center py-16">Loading admin dashboard...</div>;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={() => loadDashboard()}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Refresh Data
            </button>
          </div>

          {panelMessage.text && (
            <div className={`mb-6 rounded-lg border px-4 py-3 ${panelMessage.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
              {panelMessage.text}
            </div>
          )}

          <div className="mb-8 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-semibold">Admin Management Board</h2>
            <p className="mt-2 text-sm text-purple-100">Monitor users, partner approvals, and service booking requests from one place.</p>
          </div>

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

              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Partner Requests</h2>
                  <RoleRequestManagement onActionComplete={loadDashboard} onMessage={setPanelMessage} />
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Service Leads</h2>
                  <div className="space-y-3">
                    {serviceLeads.filter(lead => lead.status === 'pending').length > 0 ? serviceLeads.filter(lead => lead.status === 'pending').map(lead => (
                      <div key={lead._id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-800">{lead.serviceName}</p>
                            <p className="text-sm text-gray-600">{lead.customerName} • {lead.customerEmail}</p>
                          </div>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Pending</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Business: {lead.businessName || lead.business?.name || 'Unknown'}</p>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-500">No pending service booking leads.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Users</h2>
                  <div className="space-y-3">
                    {dashboard.users?.length > 0 ? dashboard.users.slice(0, 6).map(user => (
                      <div key={user._id} className="p-4 border rounded-lg border-gray-200">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-800">{user.name || 'Unnamed user'}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                            {user.role || 'user'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          {user.city || 'No city'} • Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-500">No users available yet.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Approval Summary</h2>
                  <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pending approvals</span>
                      <span className="text-xl font-semibold text-amber-600">{dashboard.counts.pendingRoleRequests || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Approved this cycle</span>
                      <span className="text-xl font-semibold text-green-600">{dashboard.counts.approvedRoleRequests || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rejected requests</span>
                      <span className="text-xl font-semibold text-red-600">{dashboard.counts.rejectedRoleRequests || 0}</span>
                    </div>
                  </div>
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
        </div>
      </div>
    </div>
  );
}
