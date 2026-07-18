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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-7xl mx-auto">
        <div className="pointer-events-none absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-48 w-48 rounded-full bg-amber-300/15 blur-3xl" />

        {/* Header */}
        <div className="relative text-center mb-12 px-4 py-10 rounded-[2rem] border border-slate-200 bg-white/80 shadow-xl backdrop-blur-xl sm:px-10 sm:py-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Become a Partner</h1>
          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto">Choose your role and expand your business opportunities with EventHub, with a responsive application experience for both mobile and desktop.</p>
          <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto">
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
        <div className="flex flex-col gap-4 justify-center items-center sm:flex-row sm:items-center">
          <button
            onClick={() => navigate('/home')}
            className="w-full sm:w-auto px-8 py-3 rounded-full border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-slate-50 transition"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full sm:w-auto px-8 py-3 rounded-full font-semibold text-white transition ${
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
