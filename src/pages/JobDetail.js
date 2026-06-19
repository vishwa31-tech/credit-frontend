import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/api';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    jobService.getById(id)
      .then(res => {
        setJob(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load job');
        setLoading(false);
      });
  }, [id]);

  const handleApply = () => {
    alert('Application submitted! We will contact you soon.');
    navigate('/jobs');
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;
  if (!job) return <div className="text-center py-12">Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/jobs')} className="text-blue-600 hover:text-blue-800 mb-6 font-semibold">
          ← Back to Jobs
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600">{job.company}</p>
            </div>
            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold capitalize">
              {job.jobType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-700 mb-4">Job Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 font-semibold">Location</p>
                  <p className="text-gray-600">{job.location}</p>
                </div>
                
                <div>
                  <p className="text-gray-700 font-semibold">Salary Range</p>
                  <p className="text-gray-600">
                    ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()} {job.salary?.currency}
                  </p>
                </div>

                <div>
                  <p className="text-gray-700 font-semibold">Experience Required</p>
                  <p className="text-gray-600">{job.experience}</p>
                </div>

                <div>
                  <p className="text-gray-700 font-semibold">Category</p>
                  <p className="text-gray-600 capitalize">{job.category}</p>
                </div>

                <div>
                  <p className="text-gray-700 font-semibold">Apply Via</p>
                  <p className="text-gray-600 capitalize">{job.applicationType || 'online'}</p>
                </div>

                <div>
                  <p className="text-gray-700 font-semibold">Applications</p>
                  <p className="text-gray-600">{job.applications} applicants</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply Now</h2>
              <button
                onClick={handleApply}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition mb-4"
              >
                Apply for this Job
              </button>
              <p className="text-gray-600 text-sm">
                By applying, you agree to our terms and conditions. The employer will contact you if selected.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.postedBy && (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Posted by</h3>
              <p className="text-gray-600"><strong>Company:</strong> {job.postedBy.name}</p>
              <p className="text-gray-600"><strong>Email:</strong> {job.postedBy.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
