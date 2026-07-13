import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../services/api';

/**
 * DashboardRouter - Redirects users to the appropriate dashboard based on their status
 * 
 * Flow:
 * 1. If not logged in → Login page
 * 2. If status = pending → Pending Approval screen
 * 3. If status = rejected → Show rejection and option to reapply
 * 4. If role = admin → Admin Dashboard
 * 5. If has secondary roles → Partner Dashboard
 * 6. Otherwise → Customer Dashboard
 */
export default function DashboardRouter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
          navigate('/login');
          return;
        }

        let userData = null;
        try {
          userData = JSON.parse(user);
        } catch (parseError) {
          console.error('Failed to parse stored user:', parseError);
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        setUserStatus(userData);

        // Redirect based on status
        if (userData.status === 'pending') {
          navigate('/pending-approval');
        } else if (userData.status === 'rejected') {
          navigate('/application-rejected');
        } else if (userData.role === 'admin') {
          navigate('/admin');
        } else if (userData.secondaryRoles && userData.secondaryRoles.length > 0) {
          navigate('/partner-dashboard');
        } else {
          navigate('/home');
        }
      } catch (err) {
        setError('Failed to determine dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4 text-4xl">⏳</div>
          <p className="text-gray-600 text-lg">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold hover:shadow-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
