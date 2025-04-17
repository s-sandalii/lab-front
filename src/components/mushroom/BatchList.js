import React, { useState, useEffect } from 'react';
import { getBatches, deleteBatch } from '../../api/batchApi';
import GrowthUpdateForm from './GrowthUpdateForm';
import ConfirmDialog from '../common/ConfirmDialog';

const BatchList = ({ onBatchUpdated }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [filter, setFilter] = useState('active'); // 'active', 'completed', 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [detailView, setDetailView] = useState(false);

  const fetchBatches = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...(filter === 'active' ? { active: true } : filter === 'completed' ? { active: false } : {}),
        sort: sortField,
        direction: sortDirection
      };
      const response = await getBatches(params);
      setBatches(response.data);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError('Failed to load batches');
    } finally {
      setLoading(false);
    }
  }, [filter, sortField, sortDirection]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const handleUpdateSuccess = () => {
    fetchBatches();
    if (onBatchUpdated) onBatchUpdated();
  };

  const handleDeleteClick = (batch) => {
    setBatchToDelete(batch);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch(batchToDelete.id);
      fetchBatches();
      if (onBatchUpdated) onBatchUpdated();
      setShowDeleteConfirm(false);
      setBatchToDelete(null);
      
      // If we deleted the selected batch, clear the selection
      if (selectedBatch?.id === batchToDelete.id) {
        setSelectedBatch(null);
      }
    } catch (err) {
      console.error('Error deleting batch:', err);
      setError('Failed to delete batch');
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredBatches = batches.filter(batch => {
    if (searchTerm === '') return true;
    return (
      batch.id.toString().includes(searchTerm) ||
      batch.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.substrate && batch.substrate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (batch.location && batch.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (batch.notes && batch.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="row">
      <div className={detailView && selectedBatch ? "col-md-7" : "col-12"}>
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h5 className="mb-0 flex-grow-1">
                <i className="bi bi-boxes me-2 text-primary"></i>
                Mushroom Batches
              </h5>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="btn-group me-2" role="group" aria-label="Batch filter">
                  <button 
                    className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('active')}
                  >
                    <i className="bi bi-lightning-charge me-1"></i>
                    Active
                  </button>
                  <button 
                    className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('completed')}
                  >
                    <i className="bi bi-flag me-1"></i>
                    Completed
                  </button>
                  <button 
                    className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('all')}
                  >
                    <i className="bi bi-list-ul me-1"></i>
                    All
                  </button>
                </div>
                <div className="input-group input-group-sm search-bar" style={{ minWidth: 220 }}>
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => setSearchTerm('')}
                      tabIndex={0}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading batches...</span>
                </div>
                <p className="mt-2">Loading batches...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                        ID {getSortIcon('id')}
                      </th>
                      <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                        Type {getSortIcon('type')}
                      </th>
                      <th onClick={() => handleSort('startDate')} style={{ cursor: 'pointer' }}>
                        Started {getSortIcon('startDate')}
                      </th>
                      <th>Progress</th>
                      <th onClick={() => handleSort('substrate')} style={{ cursor: 'pointer' }}>
                        Substrate {getSortIcon('substrate')}
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches.map((batch) => (
                      <tr 
                        key={batch.id} 
                        className={selectedBatch?.id === batch.id ? 'table-primary' : batch.isCompleted ? 'table-secondary' : ''}
                      >
                        <td>{batch.id}</td>
                        <td>{batch.type}</td>
                        <td>{new Date(batch.startDate).toLocaleDateString()}</td>
                        <td>
                          <div className="progress" style={{ height: '20px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${batch.successfulCount / batch.initialQuantity * 100}%` }}
                              aria-valuenow={batch.successfulCount} 
                              aria-valuemin="0" 
                              aria-valuemax={batch.initialQuantity}
                            >
                              {batch.successfulCount}
                            </div>
                            <div 
                              className="progress-bar bg-danger" 
                              role="progressbar" 
                              style={{ width: `${batch.contaminatedCount / batch.initialQuantity * 100}%` }}
                              aria-valuenow={batch.contaminatedCount} 
                              aria-valuemin="0" 
                              aria-valuemax={batch.initialQuantity}
                            >
                              {batch.contaminatedCount}
                            </div>
                          </div>
                          <small className="text-muted">
                            {batch.initialQuantity - batch.successfulCount - batch.contaminatedCount} remaining
                          </small>
                        </td>
                        <td>{batch.substrate || 'N/A'}</td>
                        <td>
                          {batch.isCompleted ? (
                            <span className="badge bg-secondary">Completed</span>
                          ) : (
                            <span className="badge bg-primary">Active</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => {
                                setSelectedBatch(batch);
                                setDetailView(true);
                                // Add a subtle highlight effect when opening details
                                setTimeout(() => {
                                  const detailCard = document.querySelector('.batch-detail-card');
                                  if (detailCard) {
                                  detailCard.classList.add('highlight-detail');
                                  setTimeout(() => detailCard.classList.remove('highlight-detail'), 1200);
                                  }
                                }, 100);
                                }}
                                title="View details"
                                style={{ minWidth: 38 }}
                              >
                                <i className="bi bi-info-circle"></i>
                              </button>
                              {!batch.isCompleted && (
                                <button 
                                className="btn btn-outline-success"
                                onClick={() => {
                                  setSelectedBatch(batch);
                                  setDetailView(false);
                                }}
                                title="Update growth"
                                style={{ minWidth: 38 }}
                                >
                                <i className="bi bi-arrow-up-circle"></i>
                                </button>
                              )}
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteClick(batch)}
                                title="Delete batch"
                                style={{ minWidth: 38 }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                              </div>
                            </td>
                            </tr>
                          ))}
                          {filteredBatches.length === 0 && (
                            <tr>
                            <td colSpan="7" className="text-center py-3">
                              <span className="text-muted">
                              <i className="bi bi-emoji-frown me-2"></i>
                              {searchTerm ? 'No batches match your search' : 'No batches found'}
                              </span>
                            </td>
                            </tr>
                          )}
                          </tbody>
                        </table>
                        </div>
                      )}
                      </div>
                    </div>
                    </div>
                    
                    <div className={detailView && selectedBatch ? "col-md-5" : "col-md-5 d-none d-md-block"}>
                    {selectedBatch ? (
                      detailView ? (
                      <div className="card shadow-sm batch-detail-card">
                        <div className="card-header bg-light d-flex align-items-center" style={{ borderBottom: '2px solid #e9ecef' }}>
                        <div className="d-flex align-items-center">
                          <span className="me-2">
                          <i className="bi bi-clipboard-data text-primary fs-4"></i>
                          </span>
                          <h5 className="mb-0">Batch Details</h5>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-secondary ms-auto"
                          onClick={() => setDetailView(false)}
                          title="Close details"
                        >
                          <i className="bi bi-x"></i>
                        </button>
                        </div>
                        <div className="card-body">
                        <h6 className="mb-3">
                          <span className="fw-bold">{selectedBatch.type} Mushroom</span>
                          {selectedBatch.isCompleted ? 
                          <span className="badge bg-secondary float-end ms-2">Completed</span> :
                          <span className="badge bg-primary float-end ms-2">Active</span>
                          }
                        </h6>
                        <hr />
                        <div className="row mb-3">
                          <div className="col-6">
                          <p className="mb-1 text-muted"><strong>Batch ID:</strong></p>
                          <span className="badge bg-light text-dark px-3 py-2 fs-6">{selectedBatch.id}</span>
                          </div>
                          <div className="col-6">
                          <p className="mb-1 text-muted"><strong>Start Date:</strong></p>
                          <span className="badge bg-light text-dark px-3 py-2 fs-6">{new Date(selectedBatch.startDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="row mb-3">
                          <div className="col-6">
                          <p className="mb-1 text-muted"><strong>Substrate:</strong></p>
                          <span>{selectedBatch.substrate || <span className="text-muted">Not specified</span>}</span>
                          </div>
                          <div className="col-6">
                          <p className="mb-1 text-muted"><strong>Location:</strong></p>
                          <span>{selectedBatch.location || <span className="text-muted">Not specified</span>}</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="mb-1 text-muted"><strong>Progress:</strong></p>
                          <div className="progress mb-2" style={{ height: '25px', background: '#f8f9fa' }}>
                          <div 
                            className="progress-bar bg-success" 
                            style={{ width: `${selectedBatch.successfulCount / selectedBatch.initialQuantity * 100}%` }}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            {selectedBatch.successfulCount} Successful
                          </div>
                          <div 
                            className="progress-bar bg-danger" 
                            style={{ width: `${selectedBatch.contaminatedCount / selectedBatch.initialQuantity * 100}%` }}
                          >
                            <i className="bi bi-bug me-1"></i>
                            {selectedBatch.contaminatedCount} Contaminated
                          </div>
                          </div>
                          <small className="text-muted">
                          <i className="bi bi-hourglass-split me-1"></i>
                          {selectedBatch.initialQuantity - selectedBatch.successfulCount - selectedBatch.contaminatedCount} units remaining of {selectedBatch.initialQuantity} initial units
                          </small>
                        </div>
                        
                        {selectedBatch.notes && (
                          <div className="mb-3">
                          <p className="mb-1 text-muted"><strong>Notes:</strong></p>
                          <div className="bg-light p-2 rounded border" style={{ fontStyle: 'italic' }}>
                            <i className="bi bi-journal-text me-2 text-primary"></i>
                            {selectedBatch.notes}
                          </div>
                          </div>
                        )}
                        
                        <div className="d-flex justify-content-between mt-4">
                          <button 
                          className="btn btn-primary"
                          onClick={() => setDetailView(false)}
                          disabled={selectedBatch.isCompleted}
                          title={selectedBatch.isCompleted ? "Completed batches cannot be updated" : "Update growth status"}
                          >
                          <i className="bi bi-bar-chart-line me-2"></i>
                          Update Growth
                          </button>
                          <button 
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteClick(selectedBatch)}
                          title="Permanently delete this batch"
                          >
                          <i className="bi bi-trash me-2"></i>
                          Delete Batch
                          </button>
                        </div>
                        </div>
                      </div>
                      ) : (
                      <GrowthUpdateForm 
                        batch={selectedBatch} 
                        onUpdateSuccess={handleUpdateSuccess}
                        onCancel={() => setSelectedBatch(null)} 
                      />
                      )
                    ) : (
                      <div className="card shadow-sm border-dashed border-primary-subtle h-100">
                      <div className="card-body text-center d-flex flex-column justify-content-center py-5">
                        <div className="empty-state-icon mb-3">
                        <i className="bi bi-clipboard-data fs-1 text-primary-subtle"></i>
                        </div>
                        <h5 className="text-muted mb-3">No Batch Selected</h5>
                        <p className="text-muted mb-0">Select a batch from the list to view details or update growth status</p>
                        <div className="mt-4">
                        <span className="badge bg-light text-dark p-2">
                          <i className="bi bi-info-circle me-2"></i>
                          Tip: Click <i className="bi bi-info-circle mx-1"></i> for details or <i className="bi bi-arrow-up-circle mx-1"></i> to update
                        </span>
                        </div>
                      </div>
                      </div>
                    )}
                    </div>

                    {/* Extra styles for appealing detail highlight */}
                    <style jsx>{`
                    .batch-detail-card.highlight-detail {
                      box-shadow: 0 0 0 4px #0d6efd33, 0 4px 24px rgba(0,0,0,0.08);
                      animation: highlightFade 1.2s;
                    }
                    @keyframes highlightFade {
                      0% { box-shadow: 0 0 0 8px #0d6efd66, 0 4px 24px rgba(0,0,0,0.08); }
                      100% { box-shadow: 0 0 0 0 #0d6efd00, 0 4px 24px rgba(0,0,0,0.08); }
                    }
                    .search-bar input {
                      min-width: 120px;
                    }
                    @media (max-width: 768px) {
                      .search-bar {
                        min-width: 100px !important;
                      }
                      .card-header .d-flex {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 0.5rem !important;
                      }
                      .btn-group {
                        margin-bottom: 0.5rem;
                      }
                    }
                    `}</style>
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Delete Batch"
        message={
          <div className="text-center mb-3">
            <div className="warning-icon mb-3">
              <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
            </div>
            <p>Are you sure you want to delete the <strong>{batchToDelete?.type}</strong> batch?</p>
            <div className="batch-id-badge">ID: {batchToDelete?.id}</div>
            <div className="text-muted mt-2">This action cannot be undone.</div>
          </div>
        }
        confirmText={<><i className="bi bi-trash me-2"></i>Delete</>}
        cancelText={<><i className="bi bi-x-circle me-2"></i>Cancel</>}
        confirmButtonClass="btn-danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setBatchToDelete(null);
        }}
      />
      
      {selectedBatch && detailView && (
        <div className="export-button-container">
          <button 
            className="btn btn-outline-secondary rounded-circle export-btn"
            onClick={() => exportBatchDetails(selectedBatch)}
            title="Export batch details as CSV"
          >
            <i className="bi bi-download"></i>
          </button>
        </div>
      )}
      
      <KeyboardShortcuts 
        onEscape={() => selectedBatch && setSelectedBatch(null)} 
        onEnter={() => selectedBatch && !detailView && handleUpdateSuccess()}
      />
      
      {/* CSS Styles */}
      <style jsx>{`
        /* Animation effects */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulseHighlight {
          0% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(13, 110, 253, 0); }
          100% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
        }
        
        .card {
          transition: all 0.3s ease;
          animation: fadeIn 0.4s ease-out;
        }
        
        .table-primary {
          animation: pulseHighlight 2s infinite;
        }
        
        .border-dashed {
          border-style: dashed !important;
          border-width: 2px !important;
        }
        
        .batch-id-badge {
          display: inline-block;
          background-color: #f8f9fa;
          border-radius: 4px;
          padding: 0.25rem 0.75rem;
          font-family: monospace;
          font-weight: bold;
        }
        
        .warning-icon {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        
        .export-button-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1050;
        }
        
        .export-btn {
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
          .table-responsive {
            max-height: 70vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};

const KeyboardShortcuts = ({ onEscape, onEnter }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      } else if (e.key === 'Enter' && onEnter && e.ctrlKey) {
        onEnter();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter]);
  
  return null;
};

const exportBatchDetails = (batch) => {
  if (!batch) return;
  
  const fields = [
    'id', 'type', 'startDate', 'substrate', 'location', 
    'initialQuantity', 'successfulCount', 'contaminatedCount', 'notes'
  ];
  
  const header = fields.join(',');
  const values = fields.map(field => {
    if (field === 'startDate') {
      return `"${new Date(batch[field]).toLocaleDateString()}"`;
    }
    return typeof batch[field] === 'string' ? 
      `"${batch[field].replace(/"/g, '""')}"` : batch[field];
  }).join(',');
  
  // const csv = `${header}\n${values}`; // Removed unused variable to fix ESLint warning
  
  const now = new Date();
  const enhancedCSV = 
`# Mushroom Batch Export
# Generated: ${now.toLocaleString()}
# Batch ID: ${batch.id}
# Type: ${batch.type}
#
${header}
${values}`;
  
  const exportFormat = window.confirm(
    "Choose export format:\n\n" +
    "• Click 'OK' for CSV format (spreadsheet compatible)\n" +
    "• Click 'Cancel' for JSON format (developer friendly)"
  ) ? 'csv' : 'json';
  
  let blob;
  let filename;
  
  if (exportFormat === 'csv') {
    blob = new Blob([enhancedCSV], { type: 'text/csv;charset=utf-8;' });
    filename = `mushroom-batch-${batch.id}.csv`;
  } else {
    const jsonData = {
      exportDate: now.toISOString(),
      batchData: {
        ...batch,
        startDate: new Date(batch.startDate).toISOString().split('T')[0],
        remainingUnits: batch.initialQuantity - batch.successfulCount - batch.contaminatedCount,
        successRate: ((batch.successfulCount / batch.initialQuantity) * 100).toFixed(1) + '%',
        contaminationRate: ((batch.contaminatedCount / batch.initialQuantity) * 100).toFixed(1) + '%'
      }
    };
    
    blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    filename = `mushroom-batch-${batch.id}.json`;
  }
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  const successToast = document.createElement('div');
  successToast.className = 'export-success-toast';
  successToast.innerHTML = `
    <div class="toast-content">
      <i class="bi bi-check-circle-fill text-success me-2"></i>
      Batch ${batch.id} exported as ${exportFormat.toUpperCase()}
    </div>
  `;
  document.body.appendChild(successToast);
  
  
  const style = document.createElement('style');
  style.textContent = `
    .export-success-toast {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: #fff;
      color: #333;
      padding: 10px 20px;
      border-radius: 5px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      animation: fadeInOut 2.5s ease forwards;
    }
    
    .toast-content {
      display: flex;
      align-items: center;
    }
    
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, 20px); }
      15% { opacity: 1; transform: translate(-50%, 0); }
      85% { opacity: 1; transform: translate(-50%, 0); }
      100% { opacity: 0; transform: translate(-50%, -20px); }
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    document.body.removeChild(successToast);
    document.head.removeChild(style);
  }, 2500);
};

export default BatchList;
