import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'event-owner',
      title: 'Event Owner',
      icon: '🎉',
      description: 'Host and organize events on our platform',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'catering',
      title: 'Catering Service',
      icon: '🍽️',
      description: 'Provide catering services for events',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'decoration',
      title: 'Decoration Service',
      icon: '🎨',
      description: 'Offer decoration services for events',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'photography',
      title: 'Photography Service',
      icon: '📸',
      description: 'Provide photography services for events',
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'job-seeker',
      title: 'Job Seeker',
      icon: '💼',
      description: 'Browse and apply for job opportunities',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'mahal-owner',
      title: 'Mahal/Venue Owner',
      icon: '🏛️',
      description: 'List your wedding halls and venues',
      color: 'from-rose-500 to-red-500',
    },
    {
      id: 'others',
      title: 'Other Services',
      icon: '⭐',
      description: 'Other service categories',
      color: 'from-yellow-500 to-amber-500',
    },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/role-form/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Partner</h1>
          <p className="text-xl text-gray-600">Choose your role and expand your business opportunities with EventHub</p>
          <p className="mt-3 text-sm text-slate-500">
            Selecting a service role here means you are registering as a partner. Customers can browse services only on the Services page.
          </p>
        </div>

        {/* Role Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`cursor-pointer rounded-xl border-2 transition-all duration-300 p-6 ${
                selectedRole === role.id
                  ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className={`text-5xl mb-4 bg-gradient-to-br ${role.color} bg-clip-text text-transparent`}>
                {role.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
              <p className="text-gray-600 text-sm">{role.description}</p>
              {selectedRole === role.id && (
                <div className="mt-4 flex items-center text-purple-600">
                  <span className="text-sm font-semibold">✓ Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/home')}
            className="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition ${
              selectedRole
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Application
          </button>
        </div>
      </div>
    </div>
  );
}
