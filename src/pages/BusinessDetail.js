import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { businessService } from '../services/api';

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [bookingForm, setBookingForm] = useState({
    serviceName: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    eventLocation: '',
    guestCount: '',
    budget: '',
    message: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    businessService.getById(id)
      .then(res => {
        setBusiness(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load business');
        setLoading(false);
      });
  }, [id]);

  const handleAddReview = () => {
    if (!reviewComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    businessService.addReview(id, {
      comment: reviewComment,
      rating: reviewRating,
    })
      .then(res => {
        setBusiness(res.data);
        setReviewComment('');
        setReviewRating(5);
        alert('Review added successfully!');
      })
      .catch(err => alert('Failed to add review'));
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      alert('Please log in to request a service booking.');
      navigate('/login');
      return;
    }

    const requiredFields = ['serviceName', 'customerName', 'customerEmail', 'customerPhone'];
    const missing = requiredFields.find(field => !bookingForm[field].trim());
    if (missing) {
      alert('Please complete the required booking fields.');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await businessService.bookService(id, {
        ...bookingForm,
        guestCount: bookingForm.guestCount ? Number(bookingForm.guestCount) : undefined,
        budget: bookingForm.budget ? Number(bookingForm.budget) : undefined,
      });

      alert(response.data?.message || 'Booking request sent successfully.');
      setBookingForm({
        serviceName: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        eventDate: '',
        eventLocation: '',
        guestCount: '',
        budget: '',
        message: '',
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Unable to submit booking request.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;
  if (!business) return <div className="text-center py-12">Business not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-950 via-slate-100 to-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate('/businesses')} className="text-cyan-700 hover:text-cyan-900 mb-6 font-semibold">
          ← Back to Services
        </button>

        <div className="mb-6 rounded-[2rem] border border-cyan-200 bg-cyan-50 p-5 sm:p-6 text-cyan-900 shadow-sm">
          <p className="text-base font-semibold">Viewing services only</p>
          <p className="mt-2 text-sm sm:text-base text-cyan-800 leading-relaxed">
            Customers can explore this partner&apos;s offerings here on mobile and desktop. To add your own services, register as a partner on the Join as Partner page.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-cyan-200/40">
          <div className="relative h-96 bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 flex items-center justify-center text-white text-8xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_40%)]" />
            🏢
          </div>

          <div className="p-10">
            <h1 className="text-5xl font-bold text-slate-900 mb-3">{business.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-8 text-slate-600">
              <span className="text-yellow-500 text-3xl">{'⭐'.repeat(Math.round(business.rating))}</span>
              <span>({business.rating.toFixed(1)})</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{business.reviews.length} reviews</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] mb-10">
              <div className="rounded-[1.5rem] bg-slate-50 p-6 sm:p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-slate-900 mb-5">Business Info</h2>
                <div className="space-y-3 text-slate-700 text-sm sm:text-base">
                  <p><strong>Category:</strong> <span className="capitalize text-cyan-700">{business.category}</span></p>
                  <p><strong>Email:</strong> {business.email}</p>
                  <p><strong>Phone:</strong> {business.phone}</p>
                  <p><strong>Address:</strong> {business.address}, {business.city}</p>
                  {business.website && (
                    <p><strong>Website:</strong> <a href={business.website} className="text-cyan-700 hover:underline">{business.website}</a></p>
                  )}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-cyan-50 p-6 sm:p-8 shadow-lg border border-cyan-100">
                <h2 className="text-2xl font-semibold text-slate-900 mb-5">Pricing</h2>
                <div className="space-y-4 text-slate-700 text-sm sm:text-base">
                  <p><strong>Min Budget:</strong> <span className="text-3xl font-bold text-cyan-700">${business.pricing?.minBudget || 'N/A'}</span></p>
                  <p><strong>Max Budget:</strong> <span className="text-3xl font-bold text-cyan-700">${business.pricing?.maxBudget || 'N/A'}</span></p>
                </div>
              </div>
            </div>

            {business.description && (
              <div className="mb-10 rounded-[1.5rem] bg-slate-50 p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">About</h2>
                <p className="text-slate-600 leading-relaxed">{business.description}</p>
              </div>
            )}

            <div className="mb-10 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-200 p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-emerald-900">Want to join as a partner?</h2>
                  <p className="mt-2 text-sm sm:text-base text-emerald-800">Register as a service partner to list your own business and reach more customers.</p>
                </div>
                <button
                  onClick={() => navigate('/role-selection')}
                  className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 hover:bg-emerald-700 transition"
                >
                  Register as Partner
                </button>
              </div>
            </div>

            {business.services && business.services.length > 0 && (
              <div className="mb-10 rounded-[1.5rem] bg-white p-8 shadow-lg border border-cyan-100">
                <h2 className="text-2xl font-semibold text-slate-900 mb-5">Services Offered</h2>
                <div className="flex flex-wrap gap-3">
                  {business.services.map(service => (
                    <span key={service} className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800">{service}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-10 rounded-[1.5rem] bg-amber-50 p-8 shadow-lg border border-amber-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Book This Service</h2>
              <p className="mb-6 text-sm text-slate-600">Your booking request will be sent to the admin for review and will become a lead for follow-up.</p>
              <form onSubmit={handleBookService} className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service Name *</label>
                  <input
                    type="text"
                    value={bookingForm.serviceName}
                    onChange={(e) => setBookingForm({ ...bookingForm, serviceName: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                    placeholder="e.g. Wedding Catering"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={bookingForm.customerEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerEmail: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={bookingForm.customerPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Event Date</label>
                  <input
                    type="date"
                    value={bookingForm.eventDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={bookingForm.eventLocation}
                    onChange={(e) => setBookingForm({ ...bookingForm, eventLocation: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                    placeholder="City or venue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Guest Count</label>
                  <input
                    type="number"
                    min="1"
                    value={bookingForm.guestCount}
                    onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Budget</label>
                  <input
                    type="number"
                    min="0"
                    value={bookingForm.budget}
                    onChange={(e) => setBookingForm({ ...bookingForm, budget: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    rows="4"
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                    placeholder="Tell us more about your event"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="rounded-full bg-amber-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-amber-500/30 hover:bg-amber-700 transition disabled:opacity-60"
                  >
                    {bookingLoading ? 'Submitting...' : 'Send Booking Request'}
                  </button>
                </div>
              </form>
            </div>

            <div className="mb-10 border-t border-slate-200 pt-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
              {business.reviews && business.reviews.length > 0 ? (
                <div className="space-y-6">
                  {business.reviews.map((review, idx) => (
                    <div key={idx} className="rounded-[1.5rem] bg-slate-50 p-6 shadow-sm">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <span className="font-semibold text-slate-900">{review.user?.name || 'Anonymous'}</span>
                        <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                      </div>
                      <p className="text-slate-600">{review.comment}</p>
                      <p className="mt-3 text-sm text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">No reviews yet. Be the first to share your experience!</p>
              )}
            </div>

            <div className="rounded-[1.5rem] bg-cyan-50 p-8 shadow-lg border border-cyan-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-5">Leave a Review</h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ Good</option>
                    <option value={3}>⭐⭐⭐ Average</option>
                    <option value={2}>⭐⭐ Poor</option>
                    <option value={1}>⭐ Very Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Comment</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows="5"
                  />
                </div>
                <button
                  onClick={handleAddReview}
                  className="rounded-full bg-cyan-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-cyan-500/30 hover:bg-cyan-600 transition"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
