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
  const [activeTab, setActiveTab] = useState('overview');
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
            <button
              onClick={() => setActiveTab('service-leads')}
              className={`px-6 py-3 font-semibold transition border-b-2 ${
                activeTab === 'service-leads'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Service Leads ({serviceLeads.filter(lead => lead.status === 'pending').length})
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

          {/* Service Leads Tab */}
          {activeTab === 'service-leads' && (
            <div className="space-y-4">
              {serviceLeads.length > 0 ? serviceLeads.map(lead => (
                <div key={lead._id} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{lead.serviceName}</p>
                      <p className="text-sm text-gray-600">Customer: {lead.customerName} • {lead.customerEmail}</p>
                      <p className="text-sm text-gray-600">Business: {lead.businessName || lead.business?.name || 'Unknown'}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${lead.status === 'pending' ? 'bg-amber-100 text-amber-700' : lead.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">Phone: {lead.customerPhone} • Event Date: {lead.eventDate ? new Date(lead.eventDate).toLocaleDateString() : 'N/A'}</p>
                  {lead.message && <p className="mt-2 text-sm text-gray-600">Message: {lead.message}</p>}
                </div>
              )) : (
                <p className="text-sm text-gray-500">No service booking leads yet.</p>
              )}
            </div>
          )}

          {/* Role Requests Tab */}
          {activeTab === 'role-requests' && (
            <RoleRequestManagement onActionComplete={loadDashboard} onMessage={setPanelMessage} />
          )}
        </div>
      </div>
    </div>
  );
}
