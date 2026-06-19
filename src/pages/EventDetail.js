import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, registrationService } from '../services/api';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState(1);
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    eventService.getById(id)
      .then(res => {
        setEvent(res.data);
        const firstSection = res.data.sections?.[0]?.name || '';
        const firstSpecialty = res.data.specialties?.[0]?.name || '';
        setSelectedSection(firstSection || firstSpecialty);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load event');
        setLoading(false);
      });
  }, [id]);

  const handleRegister = async () => {
    setError('');
    setMessage('');
    try {
      const payload = {
        eventId: event._id,
        ticketCount: registrations,
        specialty: event.sections?.length > 0 ? undefined : selectedSection,
        section: event.sections?.length > 0 ? selectedSection : undefined,
      };
      await registrationService.create(payload);
      setMessage(`Registration successful for ${registrations} ticket(s) in ${selectedSection || 'selected'} section.`);
      setEvent(prev => ({ ...prev, registrations: prev.registrations + registrations }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register for event');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;
  if (!event) return <div className="text-center py-12">Event not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-100 to-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/events')} className="text-purple-600 hover:text-purple-800 mb-6 font-semibold">
          ← Back to Events
        </button>

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-purple-300/20">
          <div className="relative h-96 bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-8xl font-bold">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2),_transparent_40%)]" />
            {event.category.charAt(0).toUpperCase()}
          </div>

          <div className="p-10">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">{event.title}</h1>
            <p className="text-slate-600 text-lg mb-8">{event.description}</p>

            <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-6">
                <div className="rounded-[1.5rem] bg-slate-950/95 p-8 text-white shadow-xl shadow-slate-950/20">
                  <h2 className="text-2xl font-semibold mb-5">Event Details</h2>
                  <div className="space-y-3 text-slate-200">
                    <p><strong>Category:</strong> <span className="capitalize text-fuchsia-300">{event.category}</span></p>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString()}</p>
                    <p><strong>Location:</strong> {event.location.address}, {event.location.city}, {event.location.state}</p>
                    <p><strong>Capacity:</strong> {event.capacity} people</p>
                    <p><strong>Registrations:</strong> {event.registrations}/{event.capacity}</p>
                  </div>
                </div>

                {event.sections && event.sections.length > 0 ? (
                  <div className="rounded-[1.5rem] bg-slate-100 p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Sections & Facilities</h3>
                    <div className="space-y-4">
                      {event.sections.map((section) => (
                        <div key={section.name} className="rounded-3xl border border-purple-100 bg-white p-5">
                          <h4 className="font-semibold text-purple-700">{section.name}</h4>
                          <p className="mt-2 text-slate-600">Facilities: {section.facilities?.join(', ') || 'No facilities listed'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : event.specialties && event.specialties.length > 0 ? (
                  <div className="rounded-[1.5rem] bg-slate-100 p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Specialties</h3>
                    <div className="space-y-4">
                      {event.specialties.map((specialty) => (
                        <div key={specialty.name} className="rounded-3xl border border-purple-100 bg-white p-5">
                          <h4 className="font-semibold text-purple-700">{specialty.name}</h4>
                          <p className="mt-2 text-slate-600">{specialty.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {event.tags && event.tags.length > 0 && (
                  <div className="rounded-[1.5rem] bg-purple-50 p-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-3">
                      {event.tags.map(tag => (
                        <span key={tag} className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.5rem] bg-purple-50 p-8 shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-purple-600">Book Now</p>
                      <p className="mt-4 text-5xl font-bold text-purple-700">${event.price}</p>
                      <p className="text-slate-600">per ticket</p>
                    </div>
                    <div className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-purple-700 shadow-sm">{event.capacity - event.registrations} seats left</div>
                  </div>

                  {event.sections && event.sections.length > 0 ? (
                    <div className="mt-6">
                      <label className="block text-slate-700 font-semibold mb-2">Choose a Section</label>
                      <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {event.sections.map(section => (
                          <option key={section.name} value={section.name}>{section.name}</option>
                        ))}
                      </select>
                      <p className="mt-3 text-sm text-slate-600">
                        Facilities: {event.sections.find(s => s.name === selectedSection)?.facilities?.join(', ') || 'Choose a section to view facilities.'}
                      </p>
                    </div>
                  ) : event.specialties && event.specialties.length > 0 ? (
                    <div className="mt-6">
                      <label className="block text-slate-700 font-semibold mb-2">Choose a Specialty</label>
                      <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {event.specialties.map(specialty => (
                          <option key={specialty.name} value={specialty.name}>{specialty.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <label className="block text-slate-700 font-semibold mb-2">Number of Tickets</label>
                    <input
                      type="number"
                      min="1"
                      max={event.capacity - event.registrations}
                      value={registrations}
                      onChange={(e) => setRegistrations(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
                    <p className="text-slate-600 mb-2">Total Price</p>
                    <p className="text-3xl font-bold text-purple-700">${(event.price * registrations).toFixed(2)}</p>
                  </div>

                  {message && (
                    <div className="rounded-3xl bg-green-50 border border-green-200 p-4 text-green-700">{message}</div>
                  )}
                  {error && (
                    <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>
                  )}

                  <button
                    onClick={handleRegister}
                    disabled={event.registrations >= event.capacity}
                    className="mt-4 w-full rounded-full bg-purple-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-purple-500/20 hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {event.registrations >= event.capacity ? 'Event Full' : 'Register Now'}
                  </button>
                </div>

                <div className="rounded-[1.5rem] bg-slate-50 p-8 shadow-lg">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">About This Event</h2>
                  <p className="text-slate-600 leading-relaxed">{event.details ? event.details : event.description}</p>
                </div>

                <div className="rounded-[1.5rem] bg-slate-50 p-8 shadow-lg">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Organizer</h2>
                  <p className="text-slate-600"><strong>Name:</strong> {event.organizer?.name || 'Organizer Team'}</p>
                  <p className="mt-2 text-slate-600"><strong>Email:</strong> {event.organizer?.email || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
