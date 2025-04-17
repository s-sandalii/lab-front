import React, { useState, useEffect } from 'react';
import { getBatches } from '../../api/batchApi';
import GrowthUpdateForm from './GrowthUpdateForm';

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [filter, setFilter] = useState('active'); // 'active', 'completed', 'all'

  const fetchBatches = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = filter === 'active' ? { active: true } : filter === 'completed' ? { active: false } : {};
      const response = await getBatches(params);
      setBatches(response.data);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError('Failed to load batches');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const handleUpdateSuccess = () => {
    fetchBatches();
  };

  return (
    <div className="row">
      <div className="col-md-7">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Mushroom Batches</h5>
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button 
                className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button 
                className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
            </div>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            
            {loading ? (
              <div className="text-center py-4">Loading batches...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Started</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => (
                      <tr key={batch.id} className={batch.isCompleted ? 'table-secondary' : ''}>
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
                        </td>
                        <td>
                          {batch.isCompleted ? (
                            <span className="badge bg-secondary">Completed</span>
                          ) : (
                            <span className="badge bg-primary">Active</span>
                          )}
                        </td>
                        <td>
                          {!batch.isCompleted && (
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setSelectedBatch(batch)}
                            >
                              Update
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {batches.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center">No batches found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="col-md-5">
        {selectedBatch ? (
          <GrowthUpdateForm 
            batch={selectedBatch} 
            onUpdateSuccess={handleUpdateSuccess} 
          />
        ) : (
          <div className="card">
            <div className="card-body text-center py-5">
              <p className="text-muted mb-0">Select a batch to update growth status</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchList;
