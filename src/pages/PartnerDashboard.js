import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!userData) {
        navigate('/login');
        return;
      }

      setUser(userData);

      // Fetch pending requests
      const response = await axios.get(`${API_BASE}/auth/pending-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPendingRequests(response.data.requests);
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    const icons = {
      'event-owner': '🎉',
      'catering': '🍽️',
      'decoration': '🎨',
      'photography': '📸',
      'job-seeker': '💼',
      'mahal-owner': '🏛️',
      'others': '⭐',
    };
    return icons[role] || '✨';
  };

  const getRoleTitle = (role) => {
    const titles = {
      'event-owner': 'Event Owner',
      'catering': 'Catering Service',
      'decoration': 'Decoration Service',
      'photography': 'Photography Service',
      'job-seeker': 'Job Seeker',
      'mahal-owner': 'Venue/Mahal Owner',
      'others': 'Other Services',
    };
    return titles[role] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4 text-4xl">⏳</div>
          <p className="text-gray-600 text-lg">Loading partner dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}! 🎉</h1>
          <p className="text-gray-600 text-lg">Manage your partner roles and applications</p>
        </div>

        {/* Active Roles */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ✓ Active Roles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.secondaryRoles && user.secondaryRoles.length > 0 ? (
              user.secondaryRoles.map(role => (
                <div
                  key={role}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 p-6"
                >
                  <div className="text-4xl mb-3">{getRoleIcon(role)}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{getRoleTitle(role)}</h3>
                  <p className="text-green-700 font-semibold mb-4">✓ Approved & Active</p>
                  <button
                    onClick={() => {
                      // Navigate to role-specific dashboard
                      navigate(`/role-dashboard/${role}`);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Open Dashboard
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-600">
                No active roles yet
              </div>
            )}
          </div>
        </div>

        {/* Pending Applications */}
        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              ⏳ Pending Applications
            </h2>
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <div
                  key={request._id}
                  className="bg-amber-50 rounded-lg border-2 border-amber-200 p-6 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {getRoleTitle(request.requestedRole)} Application
                    </h3>
                    <p className="text-amber-700 text-sm">
                      Submitted: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-amber-700 text-sm mt-1">
                      Status: Estimated review time 24-48 hours
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/pending-approval`)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg transition whitespace-nowrap ml-4"
                  >
                    View Status
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply for More Roles */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Want to expand your business?</h2>
              <p className="text-white/90">Apply for additional roles to reach more customers and grow your network</p>
            </div>
            <button
              onClick={() => navigate('/role-selection')}
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:shadow-lg transition whitespace-nowrap"
            >
              Apply for More Roles →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/home')}
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition"
          >
            <div className="text-3xl mb-3">🏠</div>
            <h3 className="font-bold text-gray-900 mb-1">Back to Home</h3>
            <p className="text-gray-600 text-sm">Browse events and services</p>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition"
          >
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-bold text-gray-900 mb-1">Edit Profile</h3>
            <p className="text-gray-600 text-sm">Update your information</p>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.dispatchEvent(new Event('userUpdated'));
              navigate('/login');
            }}
            className="bg-red-50 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition"
          >
            <div className="text-3xl mb-3">🚪</div>
            <h3 className="font-bold text-gray-900 mb-1">Logout</h3>
            <p className="text-gray-600 text-sm">Sign out from your account</p>
          </button>
        </div>
      </div>
    </div>
  );
}
