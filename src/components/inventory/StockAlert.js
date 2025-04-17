import React, { useState, useEffect } from 'react';
import { getLowStockAlerts } from '../../api/inventoryApi';
import { FaExclamationTriangle, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const StockAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await getLowStockAlerts();
        setAlerts(response.data);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Failed to load stock alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body text-center py-4">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading alerts...</span>
        </div>
        <p className="mt-2 text-muted">Loading stock alerts...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <div className="alert alert-danger d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          <span>{error}</span>
        </div>
      </div>
    </div>
  );
  
  if (alerts.length === 0) return null;

  return (
    <div className="card stock-alert mb-4 shadow-sm border-0">
      <div 
        className="card-header bg-warning bg-opacity-10 d-flex align-items-center justify-content-between"
        style={{ cursor: 'pointer' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="d-flex align-items-center">
          <FaExclamationTriangle className="text-warning me-2" style={{ fontSize: "1.25rem" }} />
          <h5 className="mb-0 fw-bold" style={{ color: "#b45309" }}>Low Stock Alerts</h5>
          <span className="badge bg-danger ms-2 rounded-pill">{alerts.length}</span>
        </div>
        <span>
          {isExpanded ? 
            <FaChevronUp className="text-warning" /> : 
            <FaChevronDown className="text-warning" />
          }
        </span>
      </div>
      
      {isExpanded && (
        <div className="card-body pb-2">
          <div className="row g-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-warning border-opacity-50 shadow-sm">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">{alert.materialType}</h6>
                      <span className="badge bg-danger text-white rounded-pill">Critical</span>
                    </div>
                    
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Current stock:</span>
                        <span className="fw-bold text-danger">{alert.quantity}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Threshold:</span>
                        <span className="fw-bold">{alert.thresholdLevel}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Deficit:</span>
                        <span className="fw-bold text-danger">
                          {alert.thresholdLevel - alert.quantity}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>Stock Level</span>
                        <span>{Math.round((alert.quantity/alert.thresholdLevel) * 100)}%</span>
                      </div>
                      <div className="progress" style={{ height: "8px" }}>
                        <div 
                          className="progress-bar bg-danger" 
                          role="progressbar" 
                          style={{ width: `${(alert.quantity/alert.thresholdLevel) * 100}%` }}
                          aria-valuenow={alert.quantity}
                          aria-valuemin="0"
                          aria-valuemax={alert.thresholdLevel}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {alerts.length > 0 && (
            <div className="action-panel mt-4 mb-2">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <div className="alert alert-warning bg-warning bg-opacity-10 border-warning d-flex align-items-center mb-3 py-2 px-3">
                  <FaExclamationTriangle className="text-warning me-2" />
                  <span className="small fw-medium">
                    {alerts.length} {alerts.length === 1 ? 'material' : 'materials'} need to be restocked
                  </span>
                </div>
                
                <button 
                  className="btn btn-warning btn-lg d-flex align-items-center shadow-sm position-relative overflow-hidden"
                  style={{ 
                    transition: 'all 0.3s ease',
                    borderRadius: '50px',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.classList.add('btn-warning-glow');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.classList.remove('btn-warning-glow');
                  }}
                >
                  <div className="position-relative d-flex align-items-center">
                    <div className="btn-icon-wrapper me-2  bg-opacity-25 rounded-circle p-1">
                      <FaExclamationTriangle className="text-white" />
                    </div>
                    <span className="fw-bold">Request All Low Stock Items</span>
                  </div>
                </button>
                
                <style jsx="true">{`
                  .btn-warning-glow {
                    box-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
                    transform: translateY(-2px);
                  }
                  .action-panel {
                    position: relative;
                  }
                  .action-panel:before {
                    content: '';
                    position: absolute;
                    top: -20px;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(222, 170, 12, 0.4), transparent);
                  }
                `}</style>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockAlert;
