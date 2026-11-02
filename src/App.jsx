import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Home as HomeIcon } from 'lucide-react';
import SkillRain from './components/SkillRain.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ExploreSkills from './pages/ExploreSkills.jsx';
import MySkills from './pages/MySkills.jsx';
import LearningRequests from './pages/LearningRequests.jsx';
import Matches from './pages/Matches.jsx';
import Sessions from './pages/Sessions.jsx';
import Availability from './pages/Availability.jsx';
import Messages from './pages/Messages.jsx';
import Achievements from './pages/Achievements.jsx';
import Profile from './pages/Profile.jsx';
import RatingsFeedback from './pages/RatingsFeedback.jsx';

function NotFound() {
  return (
    <div className="container py-16 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <BookOpen size={32} />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-600 max-w-md mb-6 text-sm">
        The page you are looking for does not exist or has been moved. Explore our campus skill catalog or go to your student dashboard.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <Link to="/dashboard" className="btn btn-primary">
          <HomeIcon size={16} />
          <span>Student Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <SkillRain />
      <Routes>
        <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="explore" element={<ExploreSkills />} />
        <Route path="my-skills" element={<MySkills />} />
        <Route path="requests" element={<LearningRequests />} />
        <Route path="matches" element={<Matches />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="availability" element={<Availability />} />
        <Route path="messages" element={<Messages />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="profile" element={<Profile />} />
        <Route path="ratings" element={<RatingsFeedback />} />
        <Route path="feedback" element={<RatingsFeedback />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
