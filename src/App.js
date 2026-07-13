import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Businesses from './pages/Businesses';
import BusinessDetail from './pages/BusinessDetail';
import CreateBusiness from './pages/CreateBusiness';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import JobDetail from './pages/JobDetail';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import RoleSelection from './pages/RoleSelection';
import RoleForm from './pages/RoleForm';
import PendingApproval from './pages/PendingApproval';
import PartnerDashboard from './pages/PartnerDashboard';
import ApplicationRejected from './pages/ApplicationRejected';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/businesses/:id" element={<BusinessDetail />} />
        <Route path="/businesses/create" element={<CreateBusiness />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/create" element={<CreateJob />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        {/* Multi-role registration routes */}
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/role-form/:role" element={<RoleForm />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/application-rejected" element={<ApplicationRejected />} />
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
