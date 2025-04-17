import React, { useState, useEffect } from 'react';
import BatchForm from '../components/mushroom/BatchForm';
import BatchList from '../components/mushroom/BatchList';
import { getBatchesStats } from '../api/batchApi'; 

const MushroomManagement = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('list');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  const handleBatchCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
    fetchStats();
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getBatchesStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mushroom Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setActiveTab('create')}
        >
          <i className="bi bi-plus-circle me-2"></i>
          New Batch
        </button>
      </div>
      
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card card h-100 shadow-sm border-0 hover-effect">
          <div className="card-body text-center p-4">
            <div className="icon-wrapper bg-light-subtle mb-3">
              <i className="bi bi-bar-chart-line text-primary fs-3"></i>
            </div>
            <h5 className="card-title text-muted mb-1">Total Batches</h5>
            {loading ? (
              <div className="loading-pulse"></div>
            ) : (
              <h2 className="display-4 fw-bold counter-value">{stats.total}</h2>
            )}
          </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card card h-100 shadow-sm border-0 hover-effect">
          <div className="card-body text-center p-4 bg-primary bg-gradient text-white">
            <div className="icon-wrapper bg-white bg-opacity-25 mb-3">
              <i className="bi bi-hourglass-split text-white fs-3"></i>
            </div>
            <h5 className="card-title mb-1">Active Batches</h5>
            {loading ? (
              <div className="loading-pulse bg-white"></div>
            ) : (
              <h2 className="display-4 fw-bold counter-value">{stats.active}</h2>
            )}
          </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card card h-100 shadow-sm border-0 hover-effect">
          <div className="card-body text-center p-4 bg-success bg-gradient text-white">
            <div className="icon-wrapper bg-white bg-opacity-25 mb-3">
              <i className="bi bi-check-circle text-white fs-3"></i>
            </div>
            <h5 className="card-title mb-1">Completed</h5>
            {loading ? (
              <div className="loading-pulse bg-white"></div>
            ) : (
              <h2 className="display-4 fw-bold counter-value">{stats.completed}</h2>
            )}
          </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card card h-100 shadow-sm border-0 hover-effect">
          <div className="card-body text-center p-4 bg-info bg-gradient text-white">
            <div className="icon-wrapper bg-white bg-opacity-25 mb-3">
              <i className="bi bi-graph-up-arrow text-white fs-3"></i>
            </div>
            <h5 className="card-title mb-1">Success Rate</h5>
            {loading ? (
              <div className="loading-pulse bg-white"></div>
            ) : (
              <h2 className="display-4 fw-bold counter-value">{stats.successRate}%</h2>
            )}
            <div className="mt-2 small">Last 30 days</div>
          </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .stat-card {
            transition: all 0.3s ease;
            overflow: hidden;
          }
          .hover-effect:hover {
            transform: translateY(-3px);
          }
          .icon-wrapper {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
          }
          .counter-value {
            animation: fadeScale 0.5s ease-out;
          }
          .loading-pulse {
            height: 3rem;
            margin: 0.5rem auto;
            border-radius: 4px;
            background: rgba(225, 225, 225, 0.7);
            animation: pulse 1.5s infinite;
            width: 70%;
          }
          @keyframes fadeScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}</style>
        
        {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <i className="bi bi-list-ul me-2"></i>
            Batch List
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create Batch
          </button>
        </li>
      </ul>
      
      <div className="tab-content-container">
        <div className="tab-content-wrapper py-3">
          {activeTab === 'create' ? (
            <div className="row" key="create-tab">
              <div className="col-md-10 col-lg-8 mx-auto">
                <div className="card shadow border-0">
                  <div className="card-header bg-light">
                    <h4 className="mb-0">
                      <i className="bi bi-plus-circle text-primary me-2"></i>
                      Create New Batch
                    </h4>
                  </div>
                  <div className="card-body p-4">
                    <BatchForm onBatchCreated={(batch) => {
                      handleBatchCreated();
                      setActiveTab('list');
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="batch-list-container fade-in" key="list-tab">
              <BatchList key={refreshKey} onBatchUpdated={handleBatchCreated} />
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .tab-content-container {
          min-height: 500px;
        }
        
        .tab-content-wrapper {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0.7; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .nav-tabs .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.75rem 1.25rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border-bottom-width: 2px;
        }
        
        .nav-tabs .nav-link:hover:not(.active) {
          background-color: #f8f9fa;
          border-color: #e9ecef;
        }
      `}</style>
    </div>
  );
};

export default MushroomManagement;
