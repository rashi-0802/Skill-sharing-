const fs = require('fs');
const path = require('path');

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

write('./src/layouts/MainLayout.jsx', `import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const MainLayout = () => {
  return (
    <div className="flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
`);

write('./src/components/Navbar.jsx', `import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, LogIn, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = false;
  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'My Skills', path: '/my-skills' },
    { name: 'Requests', path: '/requests' },
    { name: 'Matches', path: '/matches' },
  ];
  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <BookOpen className="text-primary" size={28} />
          <span className="font-bold text-2xl">4S</span>
        </Link>
        <nav className="navbar-links desktop-only">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className={\`nav-link \${location.pathname === link.path ? 'active' : ''}\`}>
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="navbar-actions desktop-only">
          {isLoggedIn ? (
            <Link to="/profile" className="btn btn-ghost"><User size={20} /><span>Profile</span></Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
        <button className="mobile-menu-btn mobile-only"><Menu size={24} /></button>
      </div>
    </header>
  );
};
export default Navbar;
`);

write('./src/components/Navbar.css', `.navbar { background-color: var(--bg-card); border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 100; }
.navbar-container { display: flex; align-items: center; justify-content: space-between; height: 4rem; }
.navbar-logo { display: flex; align-items: center; gap: 0.5rem; color: var(--primary); }
.navbar-links { display: flex; gap: 1.5rem; }
.nav-link { color: var(--text-muted); font-weight: 500; transition: color 0.2s; }
.nav-link:hover, .nav-link.active { color: var(--primary); }
.navbar-actions { display: flex; align-items: center; gap: 1rem; }
.mobile-menu-btn { background: none; border: none; color: var(--text-main); padding: 0.5rem; }
.desktop-only { display: flex; } .mobile-only { display: none; }
@media (max-width: 768px) { .desktop-only { display: none; } .mobile-only { display: block; } }`);

write('./src/components/Footer.jsx', `import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo"><BookOpen size={24} /><span className="font-bold text-xl">4S</span></Link>
          <p className="text-muted mt-2">Student Skill Sharing System.<br />Teach what you know, learn what you want.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/explore">Explore Skills</Link>
            <Link to="/requests">Learning Requests</Link>
            <Link to="/matches">Matches</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="text-muted text-center">&copy; {new Date().getFullYear()} 4S Platform. College DBMS Project.</p>
      </div>
    </footer>
  );
};
export default Footer;
`);

write('./src/components/Footer.css', `.footer { background-color: var(--bg-card); border-top: 1px solid var(--border-color); padding-top: 3rem; margin-top: 4rem; }
.footer-container { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 2rem; }
@media (min-width: 768px) { .footer-container { grid-template-columns: 1fr 2fr; } }
.footer-logo { display: flex; align-items: center; gap: 0.5rem; color: var(--primary); }
.footer-links { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
.footer-col h4 { margin-bottom: 1rem; font-weight: 600; color: var(--text-main); }
.footer-col a { display: block; color: var(--text-muted); margin-bottom: 0.5rem; transition: color 0.2s; }
.footer-col a:hover { color: var(--primary); }
.footer-bottom { border-top: 1px solid var(--border-color); padding: 1.5rem 0; }`);

write('./src/pages/Home.jsx', `import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, Users, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="home">
      <section className="hero py-16 text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Share Skills. Learn Together.</h1>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            4S is a peer-to-peer student platform. Teach what you're good at, and learn what you need from other students on campus.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/explore" className="btn btn-primary">Find a Skill</Link>
            <Link to="/register" className="btn btn-outline">Join 4S</Link>
          </div>
        </div>
      </section>
      <section className="features py-16" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center flex-col items-center gap-4">
              <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '50%', display: 'inline-flex' }}><Book size={32} className="text-primary" /></div>
              <h3 className="font-semibold text-xl">List Your Skills</h3>
              <p className="text-muted">Create a profile and list the skills you can teach or want to learn.</p>
            </div>
            <div className="card text-center flex-col items-center gap-4">
              <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '50%', display: 'inline-flex' }}><Search size={32} className="text-secondary" /></div>
              <h3 className="font-semibold text-xl">Find Matches</h3>
              <p className="text-muted">Our system matches you with students who have complementary needs.</p>
            </div>
            <div className="card text-center flex-col items-center gap-4">
              <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '50%', display: 'inline-flex' }}><Users size={32} className="text-accent" /></div>
              <h3 className="font-semibold text-xl">Learn & Teach</h3>
              <p className="text-muted">Connect, schedule sessions, and share knowledge peer-to-peer.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
`);
