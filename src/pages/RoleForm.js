import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function RoleForm() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessCategory: '',
    yearsOfExperience: '',
    jobTitle: '',
    industry: '',
    skills: '',
    cuisineTypes: '',
    capacity: '',
    priceRange: '',
    themeTypes: '',
    specialities: '',
    portfolio: '',
    additionalInfo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Upload documents if any
      const uploadedDocs = [];
      for (const doc of documents) {
        // In production, upload to cloud storage
        // For now, we'll just store the filename
        uploadedDocs.push({
          name: doc.name,
          url: `/documents/${doc.name}`, // Mock URL
        });
      }

      const payload = {
        requestedRole: role,
        formData: {
          ...formData,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
          cuisineTypes: formData.cuisineTypes ? formData.cuisineTypes.split(',').map(c => c.trim()) : [],
          themeTypes: formData.themeTypes ? formData.themeTypes.split(',').map(t => t.trim()) : [],
        },
        documents: uploadedDocs,
      };

      const response = await axios.post(`${API_BASE}/auth/submit-role-request`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Store request ID
      localStorage.setItem('lastRequestId', response.data.requestId);

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser && storedUser.id) {
        const updatedUser = { ...storedUser, status: 'pending' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userUpdated'));
      }

      alert('Application submitted successfully!');
      navigate('/pending-approval');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = (roleId) => {
    const titles = {
      'event-owner': 'Event Owner Application',
      'catering': 'Catering Service Application',
      'decoration': 'Decoration Service Application',
      'photography': 'Photography Service Application',
      'job-seeker': 'Job Seeker Profile',
      'mahal-owner': 'Venue Owner Application',
      'others': 'Other Services Application',
    };
    return titles[roleId] || 'Application Form';
  };

  const renderFormFields = () => {
    switch (role) {
      case 'event-owner':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Event Company Name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Business Description</label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Describe your event business, expertise, and services"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Business Category</label>
              <select
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Category</option>
                <option value="weddings">Weddings</option>
                <option value="corporate">Corporate Events</option>
                <option value="parties">Parties</option>
                <option value="conferences">Conferences</option>
                <option value="festivals">Festivals</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="5"
              />
            </div>
          </>
        );

      case 'catering':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Catering Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Catering Company"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Cuisine Types (comma-separated)</label>
              <input
                type="text"
                name="cuisineTypes"
                value={formData.cuisineTypes}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Indian, Continental, Italian"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price Range (per plate)</label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="500-2000"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Specialities (comma-separated)</label>
              <input
                type="text"
                name="specialities"
                value={formData.specialities}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Live counters, Customized menus, Themed events"
              />
            </div>
          </>
        );

      case 'decoration':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Decoration Company"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Theme Types (comma-separated)</label>
              <input
                type="text"
                name="themeTypes"
                value={formData.themeTypes}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Modern, Traditional, Minimalist, Floral"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Portfolio URL</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </>
        );

      case 'photography':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Photography Company"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Photography Style (comma-separated)</label>
              <input
                type="text"
                name="specialities"
                value={formData.specialities}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Candid, Cinematic, Artistic"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Portfolio URL</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </>
        );

      case 'job-seeker':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Job Title / Designation</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Event Manager"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Events & Entertainment"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Event Planning, Vendor Management, Budget Planning"
              />
            </div>
          </>
        );

      case 'mahal-owner':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Venue/Mahal Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Grand Palace Mahal"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Venue Type/Category</label>
              <input
                type="text"
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Wedding Hall, Banquet, Garden"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description & Amenities</label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Describe your venue, amenities, facilities"
              />
            </div>
          </>
        );

      default:
        return (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Service Description</label>
            <textarea
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
              placeholder="Describe your service"
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getRoleTitle(role)}</h1>
          <p className="text-gray-600">Fill in the details below and upload required documents</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6 flex items-start gap-3">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dynamic fields based on role */}
          {renderFormFields()}

          {/* Additional Information */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Additional Information</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="Any other information you'd like to share"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Upload Documents (Optional)</label>
            <p className="text-sm text-gray-600 mb-3">You can upload business certificates, licenses, portfolio links, resume, etc.</p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {documents.length > 0 && (
              <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">{documents.length} file(s) selected</p>
                <ul className="text-sm text-blue-800 mt-1 space-y-1">
                  {documents.map((doc, idx) => (
                    <li key={idx}>• {doc.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/role-selection')}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
