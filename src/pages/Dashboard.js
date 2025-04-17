import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/dashboardApi';
import './Dashboard.css';

import StatCard from '../components/dashboard/StatCard';
import GrowthStatusChart from '../components/dashboard/GrowthStatusChart';
import ContaminationChart from '../components/dashboard/ContaminationChart';
import MaterialOverview from '../components/dashboard/MaterialOverview';
import StockAlert from '../components/inventory/StockAlert';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner mb-3"></div>
      <p className="text-muted">Loading dashboard data...</p>
    </div>
  );
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-topbar">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Lab Dashboard</h1>
          <p className="text-muted mb-0">Welcome to Fungi Flow laboratory management system</p>
        </div>
        <div className="dashboard-actions">
          <div className="last-updated d-flex align-items-center me-3">
            <i className="bi bi-clock-history me-2"></i>
            Last updated: {new Date().toLocaleString()}
          </div>
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-arrow-repeat me-1"></i> Refresh
            </button>
            <button className="btn btn-sm btn-outline-primary">
              <i className="bi bi-printer me-1"></i> Print
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs mb-4">
        <ul className="nav nav-tabs nav-fill">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-grid me-2"></i>
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'production' ? 'active' : ''}`}
              onClick={() => setActiveTab('production')}
            >
              <i className="bi bi-bar-chart-line me-2"></i>
              Production
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <i className="bi bi-box-seam me-2"></i>
              Inventory
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'contamination' ? 'active' : ''}`}
              onClick={() => setActiveTab('contamination')}
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              Contamination
            </button>
          </li>
        </ul>
      </div>

      <div className="alert-section">
        <StockAlert />
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            <div className="dashboard-section mb-4">
              <div className="section-header">
                <h5><i className="bi bi-clipboard-data me-2"></i>Key Performance Metrics</h5>
              </div>
              <div className="row">
                <div className="col-md-3 col-sm-6 mb-4 stat-card-container">
                  <div className="card shadow border-0 rounded-3" style={{ minHeight: "160px" }}>
                    <StatCard 
                      title="Active Batches" 
                      value={stats.activeBatchCount}
                      icon={<i className="bi bi-grid-3x3-gap-fill"></i>}
                      color="#7c3aed"
                    />
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-4 stat-card-container">
                  <div className="card shadow border-0 rounded-3" style={{ minHeight: "160px" }}>
                    <StatCard 
                      title="Success Rate" 
                      value={`${stats.overallSuccessRate.toFixed(1)}%`}
                      icon={<i className="bi bi-graph-up-arrow"></i>}
                      color="#10b981"
                    />
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-4 stat-card-container">
                  <div className="card shadow border-0 rounded-3" style={{ minHeight: "160px" }}>
                    <StatCard 
                      title="Low Stock Items" 
                      value={stats.lowStockItems.length}
                      icon={<i className="bi bi-exclamation-triangle"></i>}
                      color="#f59e0b"
                    />
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-4 stat-card-container">
                  <div className="card shadow border-0 rounded-3" style={{ minHeight: "160px" }}>
                    <StatCard 
                      title="Production Ready" 
                      value={stats.productionReadyCount}
                      icon={<i className="bi bi-box-seam"></i>}
                      color="#3b82f6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-section mb-4">
              <div className="section-header">
                <h5><i className="bi bi-graph-up me-2"></i>Performance Analytics</h5>
              </div>
              <div className="row">
                <div className="col-lg-8 mb-3">
                  <div className="card chart-card shadow border-0 rounded-3">
                    <div className="card-body" style={{ height: '650px' }}>
                      <GrowthStatusChart />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mb-3">
                  <div className="card chart-card shadow border-0 rounded-3">
                    <div className="card-body" style={{ height: '650px' }}>
                      <ContaminationChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h5><i className="bi bi-list-ul me-2"></i>Raw Material Overview</h5>
              </div>
              <div className="card material-table-card shadow border-0 rounded-3">
                <div className="card-body">
                  <MaterialOverview />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'production' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h5><i className="bi bi-bar-chart-line me-2"></i>Production Analytics</h5>
            </div>
            <div className="card shadow border-0 rounded-3">
              <div className="card-body">
                <div className="text-center py-5">
                  <i className="bi bi-bar-chart-line display-1 text-muted"></i>
                  <h4 className="mt-3">Production Dashboard</h4>
                  <p className="text-muted">More detailed production analytics will be available soon.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h5><i className="bi bi-box-seam me-2"></i>Inventory Management</h5>
            </div>
            <div className="card shadow border-0 rounded-3">
              <div className="card-body">
                <MaterialOverview />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contamination' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h5><i className="bi bi-exclamation-triangle me-2"></i>Contamination Analysis</h5>
            </div>
            <div className="card shadow border-0 rounded-3">
              <div className="card-body" style={{ height: '500px' }}>
                <ContaminationChart />
              </div>
            </div>
          </div>
        )}
      </div>

      <div 
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`} style={{ fontSize: "1.25rem" }}></i>
      </div>
    </div>
  );
};

export default Dashboard;
