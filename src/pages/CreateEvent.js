import React, { useState } from 'react';
import { eventService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'wedding',
    date: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: 0,
    capacity: 100,
    tags: '',
    details: '',
    specialties: [
      { name: '', details: '' },
      { name: '', details: '' },
      { name: '', details: '' },
    ],
    sections: [
      { name: '', facilities: '' },
      { name: '', facilities: '' },
    ],
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

  const handleSpecialtyChange = (index, field, value) => {
    setFormData(prev => {
      const specialties = [...prev.specialties];
      specialties[index] = { ...specialties[index], [field]: value };
      return { ...prev, specialties };
    });
  };

  const handleSectionChange = (index, field, value) => {
    setFormData(prev => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, sections };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        specialties: formData.specialties.filter(s => s.name.trim()),
        sections: formData.sections
          .filter(s => s.name.trim())
          .map(s => ({
            name: s.name,
            facilities: s.facilities
              .split(',')
              .map(f => f.trim())
              .filter(f => f),
          })),
      };

      await eventService.create(payload);
      alert('Event created successfully!');
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Event</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Event description"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Event Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add extra details, specialties, and event highlights."
            />
          </div>

          <div className="grid gap-4 mb-4">
            {formData.specialties.map((specialty, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Specialty {index + 1}</label>
                  <input
                    type="text"
                    value={specialty.name}
                    onChange={(e) => handleSpecialtyChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Specialty name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Specialty Details</label>
                  <input
                    type="text"
                    value={specialty.details}
                    onChange={(e) => handleSpecialtyChange(index, 'details', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Short specialty notes"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 mb-4">
            {formData.sections.map((section, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-purple-50">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Section {index + 1}</label>
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Section name (e.g. VIP, General)"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Facilities</label>
                  <input
                    type="text"
                    value={section.facilities}
                    onChange={(e) => handleSectionChange(index, 'facilities', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Comma separated facilities (e.g. AC, food, Wi-Fi)"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="wedding">Wedding</option>
              <option value="festival">Festival</option>
              <option value="party">Party</option>
              <option value="conference">Conference</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Event Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., luxury, outdoor, family-friendly"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
