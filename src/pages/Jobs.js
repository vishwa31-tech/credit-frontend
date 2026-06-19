import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [jobType, setJobType] = useState('');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    jobService.getAll().then(res => {
      setJobs(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = jobType ? jobs.filter(j => j.jobType === jobType) : jobs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 via-purple-950 to-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="rounded-[2rem] bg-white/90 p-10 shadow-2xl shadow-violet-300/20 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-600 font-bold">Opportunity hub</p>
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-5xl font-extrabold">Your next event job is waiting.</h1>
              <p className="mt-4 max-w-2xl text-slate-600">Browse flexible, contract, and full-time roles from the most creative teams in the industry.</p>
            </div>
            {user?.role === 'vendor' && (
              <button
                onClick={() => window.location.assign('/jobs/create')}
                className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-500/30 hover:bg-violet-500 transition"
              >
                + Post a Job
              </button>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {['', 'full-time', 'part-time', 'contract', 'freelance'].map(type => {
            const selected = jobType === type;
            return (
              <button
                key={type || 'all'}
                onClick={() => setJobType(type)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${selected ? 'bg-violet-600 text-white shadow-lg shadow-violet-300/40' : 'bg-white text-slate-800 hover:bg-slate-200'}`}
              >
                {type ? type : 'All'}
              </button>
            );
          })}
        </div>

        <div className="mt-10 space-y-6">
          {loading ? (
            <div className="rounded-[2rem] bg-white p-12 text-center shadow-xl">Loading career opportunities...</div>
          ) : (
            filtered.map(job => (
              <Link key={job._id} to={`/jobs/${job._id}`}>
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl transition hover:-translate-y-1 hover:shadow-violet-300/30">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">{job.title}</h3>
                      <p className="mt-2 text-slate-600">{job.company}</p>
                    </div>
                    <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-violet-700">{job.jobType}</span>
                  </div>
                  <p className="mt-5 text-slate-600">{job.description.substring(0, 150)}...</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-slate-700">
                    <span className="font-semibold text-violet-700">${job.salary?.min} - ${job.salary?.max}</span>
                    <span className="text-sm">{job.location}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
