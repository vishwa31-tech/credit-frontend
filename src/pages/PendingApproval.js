import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function PendingApproval() {
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const requestId = localStorage.getItem('lastRequestId');
        const token = localStorage.getItem('token');

        if (!requestId) {
          setError('No application found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE}/auth/request-status/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const requestData = response.data.request || response.data;
        setRequest(requestData);

        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          window.dispatchEvent(new Event('userUpdated'));
        }
      } catch (err) {
        setError('Failed to fetch application status');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestStatus();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchRequestStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRoleDisplay = (role) => {
    const mapping = {
      'event-owner': 'Event Owner',
      'job-seeker': 'Job Seeker',
      'mahal-owner': 'Venue/Mahal Owner',
      'catering': 'Catering Service',
      'decoration': 'Decoration Service',
      'photography': 'Photography Service',
      'others': 'Other Services',
    };
    return mapping[role] || role;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'from-amber-500 to-orange-500';
      case 'approved':
        return 'from-green-500 to-emerald-500';
      case 'rejected':
        return 'from-red-500 to-rose-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4 text-4xl">⏳</div>
          <p className="text-gray-600 text-lg">Loading application status...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">{error}</h2>
            <p className="text-red-700 mb-6">Unable to fetch your application status</p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold hover:shadow-lg transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Status Card */}
        <div className={`bg-gradient-to-br ${getStatusColor(request.status)} rounded-xl shadow-2xl p-8 mb-8 text-white`}>
          <div className="text-6xl mb-4">{getStatusIcon(request.status)}</div>
          <h1 className="text-3xl font-bold mb-2">
            {request.status === 'pending' && 'Application Under Review'}
            {request.status === 'approved' && 'Congratulations! Approved'}
            {request.status === 'rejected' && 'Application Rejected'}
          </h1>
          <p className="text-lg opacity-90">
            {request.status === 'pending' && 'Your application is being reviewed by our team.'}
            {request.status === 'approved' && 'Your role has been successfully activated!'}
            {request.status === 'rejected' && 'Unfortunately, your application was not approved.'}
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📋 Application Details
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <p className="text-gray-600 text-sm font-semibold">REQUESTED ROLE</p>
                <p className="text-gray-900 text-lg font-bold">{getRoleDisplay(request.requestedRole)}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-white text-sm font-bold capitalize bg-gradient-to-r ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 py-4 border-b">
              <div>
                <p className="text-gray-600 text-sm font-semibold">SUBMITTED ON</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(request.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">EXPECTED REVIEW TIME</p>
                <p className="text-gray-900 font-semibold">24-48 Hours</p>
              </div>
            </div>

            {request.status === 'approved' && (
              <div className="py-4 border-b">
                <p className="text-gray-600 text-sm font-semibold">APPROVED ON</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(request.approvedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            {request.status === 'rejected' && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 my-4">
                <p className="text-red-900 font-bold mb-2">Rejection Reason:</p>
                <p className="text-red-800">{request.rejectionReason}</p>
              </div>
            )}

            {request.adminNotes && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 my-4">
                <p className="text-blue-900 font-bold mb-2">Admin Notes:</p>
                <p className="text-blue-800">{request.adminNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📍 Application Timeline
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div className="w-0.5 h-8 bg-green-300 mt-2"></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Submitted</p>
                <p className="text-gray-600">{new Date(request.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  request.status === 'pending'
                    ? 'bg-amber-100 text-amber-600 animate-pulse'
                    : request.status === 'approved'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {request.status === 'pending' ? '⏳' : request.status === 'approved' ? '✓' : '✕'}
                </div>
                {request.status === 'pending' && <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>}
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {request.status === 'pending' && 'Under Review'}
                  {request.status === 'approved' && 'Approved'}
                  {request.status === 'rejected' && 'Rejected'}
                </p>
                {request.approvedAt && (
                  <p className="text-gray-600">{new Date(request.approvedAt).toLocaleString()}</p>
                )}
                {request.rejectedAt && (
                  <p className="text-gray-600">{new Date(request.rejectedAt).toLocaleString()}</p>
                )}
                {request.status === 'pending' && (
                  <p className="text-gray-600">Estimated completion: 24-48 hours</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/home')}
            className="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Back to Home
          </button>
          {request.status === 'rejected' && (
            <button
              onClick={() => navigate('/role-selection')}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition"
            >
              Apply Again
            </button>
          )}
          {request.status === 'approved' && (
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition"
            >
              Access Dashboard
            </button>
          )}
        </div>

        {/* Info Box */}
        {request.status === 'pending' && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-8 text-center">
            <p className="text-blue-900">
              <strong>💡 Tip:</strong> This page will automatically refresh every 10 seconds to show any updates. You'll also receive an email notification once your application is reviewed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
