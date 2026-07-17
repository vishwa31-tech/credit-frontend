import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/api';

const jobTypes = ['', 'full-time', 'part-time', 'contract', 'freelance'];

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
    <div className="min-h-screen bg-gradient-to-b from-violet-950 via-purple-900 to-slate-100 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-36 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-600 via-violet-700 to-indigo-900 p-10 shadow-2xl shadow-violet-900/30 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200 font-bold">Opportunity hub</p>
            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-5xl font-extrabold">Your next event job is waiting.</h1>
                <p className="mt-4 max-w-2xl text-slate-200">Browse flexible, contract, and full-time roles from the most creative teams in the industry.</p>
              </div>
              {user?.role === 'vendor' && (
                <button
                  onClick={() => window.location.assign('/jobs/create')}
                  className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-500/30 hover:bg-white/20 transition"
                >
                  + Post a Job
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mt-10 flex flex-wrap gap-3">
          {jobTypes.map(type => {
            const selected = jobType === type;
            return (
              <button
                key={type || 'all'}
                onClick={() => setJobType(type)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${selected ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-300/30' : 'bg-white text-slate-800 hover:bg-slate-200'}`}
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
                <div className="rounded-[2rem] border border-white/10 bg-white shadow-2xl transition hover:-translate-y-1 hover:shadow-fuchsia-300/30">
                  <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-700 p-6 text-white rounded-t-[1.75rem]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="text-3xl font-bold">{job.title}</h3>
                        <p className="mt-2 text-slate-100">{job.company}</p>
                      </div>
                      <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-white">{job.jobType}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-700">{job.description.substring(0, 150)}...</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-slate-700">
                      <span className="font-semibold text-violet-700">${job.salary?.min} - ${job.salary?.max}</span>
                      <span className="text-sm">{job.location}</span>
                    </div>
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
