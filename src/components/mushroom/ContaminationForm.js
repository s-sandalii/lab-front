import React, { useState } from 'react';

const ContaminationForm = ({ onSubmit, maxCount, currentBatch }) => {
  const [formData, setFormData] = useState({
    reason: 'MOLD',
    count: 0,
    details: ''
  });
  const [showHelp, setShowHelp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'count' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.count > 0) {
      onSubmit(formData);
      setFormData({
        reason: 'MOLD',
        count: 0,
        details: ''
      });
    }
  };

  // Enhanced: Reason options with icons
  const reasonOptions = [
    { value: 'MOLD', label: 'Mold', icon: 'bi-bug-fill text-success' },
    { value: 'BACTERIA', label: 'Bacteria', icon: 'bi-virus text-warning' },
    { value: 'TEMPERATURE', label: 'Temperature Issue', icon: 'bi-thermometer-half text-danger' },
    { value: 'HUMIDITY', label: 'Humidity Issue', icon: 'bi-droplet-half text-primary' },
    { value: 'PESTS', label: 'Pests/Insects', icon: 'bi-bug text-dark' },
    { value: 'HANDLING', label: 'Improper Handling', icon: 'bi-hand-index-thumb text-secondary' },
    { value: 'OTHER', label: 'Other', icon: 'bi-question-circle text-muted' }
  ];

  return (
    <div className="card shadow-lg border-danger position-relative">
      <div className="card-header bg-gradient-danger text-white d-flex align-items-center">
        <i className="bi bi-exclamation-octagon-fill fs-3 me-2"></i>
        <h5 className="mb-0 flex-grow-1">Report Contamination</h5>
        <button
          type="button"
          className="btn btn-light btn-sm rounded-circle shadow-sm ms-2"
          style={{ opacity: 0.8 }}
          onClick={() => setShowHelp(true)}
          title="Learn about contamination reporting"
        >
          <i className="bi bi-question-circle text-danger"></i>
        </button>
      </div>
      <div className="card-body bg-light">
        {currentBatch && (
          <div className="alert alert-info mb-3 d-flex align-items-center">
            <i className="bi bi-box-seam me-2"></i>
            <span>
              <strong>Batch:</strong> {currentBatch.type} <span className="badge bg-secondary ms-2">ID: {currentBatch.id}</span>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group mb-4">
            <label htmlFor="count" className="form-label fw-semibold">
              <i className="bi bi-exclamation-triangle-fill text-danger me-1"></i>
              Contaminated Count
            </label>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-danger text-white">
                <i className="bi bi-exclamation-triangle"></i>
              </span>
              <input
                type="number"
                id="count"
                name="count"
                className="form-control border-danger"
                min="1"
                max={maxCount || 100}
                value={formData.count}
                onChange={handleChange}
                required
                aria-label="Contaminated Count"
              />
              <span className="input-group-text">units</span>
            </div>
            {maxCount && (
              <small className="form-text text-muted ms-1">
                <i className="bi bi-info-circle"></i> Maximum {maxCount} units available
              </small>
            )}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="reason" className="form-label fw-semibold">
              <i className="bi bi-clipboard2-pulse text-danger me-1"></i>
              Contamination Reason
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className={reasonOptions.find(opt => opt.value === formData.reason)?.icon}></i>
              </span>
              <select
                id="reason"
                name="reason"
                className="form-select border-danger"
                value={formData.reason}
                onChange={handleChange}
                required
                aria-label="Contamination Reason"
              >
                {reasonOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="details" className="form-label fw-semibold">
              <i className="bi bi-chat-left-text text-danger me-1"></i>
              Additional Details
            </label>
            <textarea
              id="details"
              name="details"
              className="form-control border-danger"
              rows="2"
              placeholder="Optional details about the contamination..."
              value={formData.details}
              onChange={handleChange}
              aria-label="Additional Details"
            ></textarea>
          </div>

          <div className="contamination-severity mb-4">
            <label className="form-label d-flex justify-content-between align-items-center fw-semibold">
              <span>
                <i className="bi bi-activity text-danger me-1"></i>
                Severity Level
              </span>
              <span className={`badge bg-${getSeverityColor(formData.count, maxCount)} fs-6`}>
                {getSeverityLabel(formData.count, maxCount)}
              </span>
            </label>
            <div className="progress" style={{ height: '12px', background: '#f8d7da' }}>
              <div
                className={`progress-bar bg-${getSeverityColor(formData.count, maxCount)}`}
                role="progressbar"
                style={{
                  width: `${Math.min((formData.count / (maxCount || 100)) * 100, 100)}%`,
                  transition: 'width 0.3s cubic-bezier(.4,2,.6,1)'
                }}
                aria-valuenow={formData.count}
                aria-valuemin="0"
                aria-valuemax={maxCount || 100}
              ></div>
            </div>
            <small className="text-muted mt-1 d-block">
              Based on <strong>{formData.count}</strong> out of <strong>{maxCount || 'total'}</strong> units
            </small>
          </div>

          <div className="d-flex justify-content-end align-items-center gap-2">
            <button
              className="btn btn-danger contamination-submit-btn px-4 py-2 fs-6"
              type="submit"
              disabled={formData.count <= 0}
            >
              <i className="bi bi-exclamation-octagon me-2"></i>
              Record Contamination
            </button>
          </div>
        </form>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-danger">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bi bi-question-circle me-2"></i>
                  Contamination Reporting Help
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowHelp(false)}></button>
              </div>
              <div className="modal-body">
                <ol className="mb-2">
                  <li>Enter the <strong>number of contaminated units</strong>.</li>
                  <li>Select the <strong>primary reason</strong> for contamination.</li>
                  <li>Add <strong>optional details</strong> if needed.</li>
                  <li>Click <strong>Record Contamination</strong> to submit.</li>
                </ol>
                <div className="alert alert-warning mt-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Please ensure the count does not exceed the available units.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => setShowHelp(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS styles */}
      <style jsx>{`
        .contamination-submit-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(.4,2,.6,1);
          font-weight: 600;
          letter-spacing: 0.02em;
          border-radius: 0.5rem;
        }
        .contamination-submit-btn:not(:disabled):hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 16px rgba(220, 53, 69, 0.25);
        }
        .contamination-submit-btn:not(:disabled):active {
          transform: translateY(0) scale(1);
        }
        .form-control:focus, .form-select:focus {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.18);
        }
        .modal.fade.show {
          animation: fadeInModal 0.3s;
        }
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content {
          border-radius: 1rem;
        }
        .progress-bar.bg-warning { background-color: #ffc107 !important; }
        .progress-bar.bg-danger { background-color: #dc3545 !important; }
        .progress-bar.bg-secondary { background-color: #6c757d !important; }
        .badge.bg-warning { background-color: #ffc107 !important; color: #212529; }
        .badge.bg-danger { background-color: #dc3545 !important; }
        .badge.bg-secondary { background-color: #6c757d !important; }
        .bg-gradient-danger {
          background: linear-gradient(90deg, #dc3545 0%, #ff6f91 100%);
        }
      `}</style>
    </div>
  );
};

// Helper function to determine severity level based on count
const getSeverityLabel = (count, maxCount) => {
  if (!count) return 'None';
  const ratio = count / (maxCount || 100);
  if (ratio < 0.2) return 'Low';
  if (ratio < 0.5) return 'Moderate';
  if (ratio < 0.8) return 'High';
  return 'Critical';
};

// Helper function to determine severity color
const getSeverityColor = (count, maxCount) => {
  if (!count) return 'secondary';
  const ratio = count / (maxCount || 100);
  if (ratio < 0.2) return 'warning';
  if (ratio < 0.5) return 'danger';
  if (ratio < 0.8) return 'danger';
  return 'danger';
};

export default ContaminationForm;
