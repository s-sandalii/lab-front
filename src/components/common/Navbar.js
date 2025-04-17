import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location]);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark shadow-sm sticky-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div 
        className="navbar-gradient position-absolute top-0 start-0 end-0 bottom-0" 
        style={{ 
          background: 'linear-gradient(135deg, #2a9d8f 0%, #006400 100%)',
          zIndex: -1,
          opacity: scrolled ? 0.8 : 1,
          transition: 'opacity 0.3s ease'
        }}
      ></div>
      <div className="container py-2">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="brand-logo-container d-flex align-items-center justify-content-center rounded-circle bg-white p-1 me-2">
            <img 
              src="/logo512.png" 
              alt="Fungi Flow Logo" 
              height="32" 
              className="logo-image"
              style={{ transition: 'all 0.3s ease' }}
            />
          </div>
          <div className="brand-text">
            <span className="fw-bold fs-5">Fungi Flow</span>
            <span className="d-block text-white-50 small logo-subtitle">Mushroom Lab Manager</span>
          </div>
        </Link>
        
        <button 
          className={`navbar-toggler border-0 ${mobileNavOpen ? 'open' : ''}`}
          type="button" 
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-controls="navbarNav"
          aria-expanded={mobileNavOpen}
          aria-label="Toggle navigation"
        >
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div className={`collapse navbar-collapse ${mobileNavOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto py-2 py-lg-0">
            {[
              { path: '/', icon: 'bi-speedometer2', label: 'Dashboard' },
              { path: '/mushroom-management', icon: 'bi-diagram-3', label: 'Mushroom Management' },
              { path: '/lab-inventory', icon: 'bi-box-seam', label: 'Lab Inventory' }
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <Link 
                  className={`nav-link px-3 nav-link-custom ${location.pathname === item.path ? 'active fw-bold' : ''}`} 
                  to={item.path}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <span className="nav-indicator position-absolute"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            <div className="date-badge d-none d-md-flex align-items-center me-3 px-3 py-1 bg-white bg-opacity-10 rounded-pill text-white">
              <i className="bi bi-calendar3 me-2"></i>
              <span className="small">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            
            <div className="dropdown user-dropdown" ref={dropdownRef}>
              <div 
                className="d-flex align-items-center text-white cursor-pointer user-menu" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="user-avatar bg-white rounded-circle d-flex justify-content-center align-items-center me-2" 
                  style={{ 
                    width: '38px', 
                    height: '38px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  <i className="bi bi-person-fill text-success"></i>
                </div>
                <div className="d-none d-md-block">
                  <span className="user-name d-block fw-medium">Lab Technician</span>
                  <span className="user-role d-block text-white-50 small">Staff</span>
                </div>
                <i className={`bi bi-chevron-down ms-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.2s ease' }}></i>
              </div>
              
              <div 
                className={`dropdown-menu dropdown-menu-end user-dropdown-menu shadow-lg border-0 py-2 ${dropdownOpen ? 'show' : ''}`}
                style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: '55px',
                  opacity: dropdownOpen ? 1 : 0,
                  transform: dropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'opacity 0.2s, transform 0.2s',
                  borderRadius: '12px',
                  minWidth: '220px'
                }}
              >
                <div className="dropdown-header text-center py-2 border-bottom">
                  <p className="mb-0 text-dark fw-bold">Lab Technician</p>
                  <small className="text-muted">john.doe@fungiflow.com</small>
                </div>
                {[
                  { path: '/profile', icon: 'bi-person', label: 'My Profile' },
                  { path: '/settings', icon: 'bi-gear', label: 'Settings' },
                  { path: '/help', icon: 'bi-question-circle', label: 'Help Center' }
                ].map((item) => (
                  <Link 
                    key={item.path}
                    className="dropdown-item d-flex align-items-center px-3 py-2" 
                    to={item.path}
                  >
                    <i className={`bi ${item.icon} me-2`}></i>
                    {item.label}
                  </Link>
                ))}
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item d-flex align-items-center px-3 py-2 text-danger" to="/logout">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .navbar-scrolled {
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .navbar-scrolled .navbar-gradient {
          opacity: 0.8;
        }
        
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: rgba(0,0,0,0.1);
            margin: 10px -12px -8px;
            padding: 20px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }
          .nav-item {
            margin-bottom: 8px;
          }
        }
        
        .nav-link-custom {
          position: relative;
          transition: all 0.2s ease;
          border-radius: 8px;
        }
        
        .nav-link-custom:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .nav-link-custom.active {
          background-color: rgba(255, 255, 255, 0.15);
        }
        
        .nav-indicator {
          bottom: -2px;
          left: 50%;
          width: 16px;
          height: 2px;
          background: white;
          border-radius: 1px;
          transform: translateX(-50%);
        }
        
        .nav-item {
          margin: 0 6px;
        }
        
        @media (min-width: 992px) {
          .nav-item {
            margin: 0 8px;
          }
        }
        
        .hamburger-icon {
          width: 30px;
          height: 24px;
          position: relative;
          transition: all 0.25s;
        }
        
        .hamburger-icon span {
          display: block;
          position: absolute;
          height: 2px;
          width: 100%;
          background: white;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: all 0.25s;
        }
        
        .hamburger-icon span:nth-child(1) {
          top: 0;
        }
        
        .hamburger-icon span:nth-child(2) {
          top: 10px;
        }
        
        .hamburger-icon span:nth-child(3) {
          top: 20px;
        }
        
        .navbar-toggler.open .hamburger-icon span:nth-child(1) {
          top: 10px;
          transform: rotate(135deg);
        }
        
        .navbar-toggler.open .hamburger-icon span:nth-child(2) {
          opacity: 0;
          left: -60px;
        }
        
        .navbar-toggler.open .hamburger-icon span:nth-child(3) {
          top: 10px;
          transform: rotate(-135deg);
        }
        
        .rotate-180 {
          transform: rotate(180deg);
        }
        
        .dropdown-item {
          transition: background-color 0.15s ease;
          border-radius: 4px;
          margin: 2px 5px;
        }
        
        .dropdown-item:active, .dropdown-item:focus {
          background-color: rgba(42, 157, 143, 0.1);
          color: #2a9d8f;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
