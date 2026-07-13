import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';

export default function RoleRequestManagement({ onActionComplete, onMessage }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    onMessage?.({ type, text });
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminService.getRoleRequests(filterStatus);
      setRequests(response.data.requests || []);
    } catch (err) {
      setError('Failed to fetch requests');
      showFeedback('error', 'Unable to load role requests right now.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(true);
      const response = await adminService.approveRoleRequest(requestId, { adminNotes });
      showFeedback('success', response.data?.message || 'Role request approved successfully');
      setSelectedRequest(null);
      setAdminNotes('');
      setRejectionReason('');
      if (onActionComplete) {
        await onActionComplete();
      } else {
        await fetchRequests();
      }
    } catch (err) {
      showFeedback('error', err.response?.data?.error || 'Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectionReason.trim()) {
      showFeedback('error', 'Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      const response = await adminService.rejectRoleRequest(requestId, { rejectionReason });
      showFeedback('success', response.data?.message || 'Role request rejected successfully');
      setSelectedRequest(null);
      setRejectionReason('');
      setAdminNotes('');
      if (onActionComplete) {
        await onActionComplete();
      } else {
        await fetchRequests();
      }
    } catch (err) {
      showFeedback('error', err.response?.data?.error || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'event-owner': 'bg-purple-100 text-purple-800',
      'catering': 'bg-green-100 text-green-800',
      'decoration': 'bg-blue-100 text-blue-800',
      'photography': 'bg-amber-100 text-amber-800',
      'job-seeker': 'bg-indigo-100 text-indigo-800',
      'mahal-owner': 'bg-rose-100 text-rose-800',
      'others': 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading && requests.length === 0) {
    return <div className="text-center py-12 text-gray-600">Loading role requests...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3">
        {['pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === status
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({
              requests.filter(r => r.status === status).length
            })
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {feedback.text && (
        <div className={`rounded-lg border px-4 py-3 ${feedback.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
          {feedback.text}
        </div>
      )}

      {/* Requests List */}
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-600">
            No {filterStatus} requests found.
          </div>
        ) : (
          requests.map(request => (
            <div
              key={request._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {request.userId?.name || 'Unknown User'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(request.requestedRole)}`}>
                      {request.requestedRole.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      request.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    📧 {request.userId?.email || 'No email'}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    📱 {request.userId?.phone || 'No phone'} • 📍 {request.userId?.city || 'No city'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl mb-2">
                    {request.requestedRole === 'event-owner' && '🎉'}
                    {request.requestedRole === 'catering' && '🍽️'}
                    {request.requestedRole === 'decoration' && '🎨'}
                    {request.requestedRole === 'photography' && '📸'}
                    {request.requestedRole === 'job-seeker' && '💼'}
                    {request.requestedRole === 'mahal-owner' && '🏛️'}
                    {request.requestedRole === 'others' && '⭐'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Applicant Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{selectedRequest.userId?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{selectedRequest.userId?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{selectedRequest.userId?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="font-semibold text-gray-900">{selectedRequest.userId?.city}</p>
                </div>
              </div>
            </div>

            {/* Application Data */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Application Form Data</h3>
              <div className="space-y-3 text-sm">
                {Object.entries(selectedRequest.formData || {}).map(([key, value]) => {
                  if (!value) return null;
                  const displayKey = key.replace(/([A-Z])/g, ' $1').trim();
                  const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
                  return (
                    <div key={key} className="border-b pb-2">
                      <p className="text-gray-600 capitalize">{displayKey}:</p>
                      <p className="font-semibold text-gray-900">{displayValue}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Documents */}
            {selectedRequest.documents?.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Uploaded Documents</h3>
                <ul className="space-y-2">
                  {selectedRequest.documents.map((doc, idx) => (
                    <li key={idx} className="text-sm">
                      📄 <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{doc.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Section */}
            {selectedRequest.status === 'pending' && (
              <div className="space-y-4 pt-6 border-t">
                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Add any notes for the applicant..."
                  />
                </div>

                {/* Rejection Reason */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="3"
                    placeholder="Explain why the application is being rejected..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedRequest._id)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest._id)}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : '✕ Reject'}
                  </button>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    disabled={actionLoading}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {selectedRequest.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-900 font-semibold">✓ Approved on {new Date(selectedRequest.approvedAt).toLocaleString()}</p>
                {selectedRequest.adminNotes && (
                  <p className="text-green-800 mt-2">Admin Notes: {selectedRequest.adminNotes}</p>
                )}
              </div>
            )}

            {selectedRequest.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-900 font-semibold">✕ Rejected on {new Date(selectedRequest.rejectedAt).toLocaleString()}</p>
                <p className="text-red-800 mt-2">Reason: {selectedRequest.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
