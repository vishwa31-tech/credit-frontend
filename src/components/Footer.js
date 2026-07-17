import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white py-16 mt-16">
      <div className="absolute -right-20 -top-16 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute -left-24 bottom-10 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-3xl font-bold">EventHub</h3>
            <p className="text-slate-300 max-w-xl">
              A vibrant destination for events, vendors, jobs, and news that connects everyone with unforgettable experiences.
            </p>
            <Link
              to="/role-selection"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-fuchsia-400 transition"
            >
              Become a Partner
            </Link>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-[0.18em] text-slate-200">Quick Links</h4>
            <ul className="space-y-3 text-slate-300">
              <li>
                <Link to="/events" className="hover:text-white transition">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/businesses" className="hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition">
                  News
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-[0.18em] text-slate-200">Support</h4>
            <ul className="space-y-3 text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-[0.18em] text-slate-200">Follow Us</h4>
            <div className="flex flex-wrap gap-4 text-2xl text-slate-300">
              <a href="#" className="rounded-full bg-white/5 px-3 py-2 hover:bg-white/10 transition">
                Home
              </a>
              <a href="#" className="rounded-full bg-white/5 px-3 py-2 hover:bg-white/10 transition">
                About
              </a>
              <a href="#" className="rounded-full bg-white/5 px-3 py-2 hover:bg-white/10 transition">
                📷
              </a>
              <a href="#" className="rounded-full bg-white/5 px-3 py-2 hover:bg-white/10 transition">
                ▶️
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-slate-400">
          <p>© 2024 EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
