import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Fungi Flow</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/mushroom-management' ? 'active' : ''}`} to="/mushroom-management">
                Mushroom Management
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/lab-inventory' ? 'active' : ''}`} to="/lab-inventory">
                Lab Inventory
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
