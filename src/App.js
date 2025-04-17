import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import MushroomManagement from './pages/MushroomManagement';
import LabInventory from './pages/LabInventory';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mushroom-management" element={<MushroomManagement />} />
            <Route path="/lab-inventory" element={<LabInventory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 


