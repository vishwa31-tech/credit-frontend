import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;
      const response = await axios.post(`${API_BASE}/auth/register`, payload);
      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('userUpdated'));

      alert('Account created successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {formData.role === 'admin' ? 'Admin Registration' : formData.role === 'vendor' ? 'Event Owner Registration' : 'Customer Registration'}
        </h1>
        <p className="text-gray-600 text-center mb-6">Choose your account type and register to browse events, manage listings, or administer the platform.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
            className={`w-full rounded-2xl border px-5 py-4 text-left transition ${formData.role === 'user' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-purple-600 font-bold mb-2">Customer</p>
            <p className="text-gray-700">Browse events, choose the best option, and register easily.</p>
          </button>

          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, role: 'vendor' }))}
            className={`w-full rounded-2xl border px-5 py-4 text-left transition ${formData.role === 'vendor' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-purple-600 font-bold mb-2">Event Owner</p>
            <p className="text-gray-700">Create and manage event listings for your customers.</p>
          </button>

          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
            className={`w-full rounded-2xl border px-5 py-4 text-left transition ${formData.role === 'admin' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-purple-600 font-bold mb-2">Admin</p>
            <p className="text-gray-700">Manage the platform, review events, jobs, and registrations.</p>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="123-456-7890"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="New York"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Registration Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="user">Customer</option>
              <option value="vendor">Event Owner</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Customers can browse and register for events. Event Owners can add event listings.
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-bold hover:text-purple-700">
              Sign In
            </Link>
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 font-semibold"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
