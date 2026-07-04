import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ApplicationRejected() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const rejectionReason = user.rejectionReason || 'Your application did not meet our requirements.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Rejection Card */}
        <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-red-900 mb-4">Application Rejected</h1>
          <p className="text-xl text-gray-700 mb-6">
            Unfortunately, your recent application was not approved at this time.
          </p>

          {/* Rejection Reason */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8 text-left">
            <p className="font-bold text-red-900 mb-3">Reason for Rejection:</p>
            <p className="text-red-800">{rejectionReason}</p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8 text-left">
            <p className="font-bold text-blue-900 mb-3">What You Can Do:</p>
            <ul className="text-blue-800 space-y-2">
              <li>✓ Review the rejection reason carefully</li>
              <li>✓ Update your information to address the concerns</li>
              <li>✓ Submit a new application with improved details</li>
              <li>✓ Contact support if you need assistance</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/role-selection')}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition"
            >
              Apply Again
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> You can apply for the same or different roles multiple times. Make sure your application materials are complete and clearly demonstrate your qualifications.
            </p>
          </div>
        </div>

        {/* Support Card */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-700 mb-4">
            If you believe this decision was made in error or have questions about the rejection, feel free to contact our support team.
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
