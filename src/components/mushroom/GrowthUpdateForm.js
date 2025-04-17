import React, { useState } from 'react';
import { updateBatchProgress } from '../../api/batchApi';

const GrowthUpdateForm = ({ batch, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    successful: 0,
    contaminated: 0,
    reason: 'MOLD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'successful' || name === 'contaminated' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await updateBatchProgress(batch.id, formData);
      
      setSuccess('Growth updated successfully');
      setFormData({
        successful: 0,
        contaminated: 0,
        reason: 'MOLD'
      });
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error('Error updating growth:', err);
      setError(err.response?.data?.message || 'Failed to update growth');
    } finally {
      setLoading(false);
    }
  };

  const remainingQuantity = batch.initialQuantity - (batch.successfulCount + batch.contaminatedCount);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Update Growth Status</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="mb-3">
          <strong>Batch:</strong> {batch.type} (ID: {batch.id})
          <br />
          <strong>Remaining:</strong> {remainingQuantity} of {batch.initialQuantity}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label htmlFor="successful">Successful Growth</label>
                <input
                  type="number"
                  id="successful"
                  name="successful"
                  className="form-control"
                  value={formData.successful}
                  onChange={handleChange}
                  min="0"
                  max={remainingQuantity}
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label htmlFor="contaminated">Contaminated</label>
                <input
                  type="number"
                  id="contaminated"
                  name="contaminated"
                  className="form-control"
                  value={formData.contaminated}
                  onChange={handleChange}
                  min="0"
                  max={remainingQuantity - formData.successful}
                  required
                />
              </div>
            </div>
          </div>
          
          {formData.contaminated > 0 && (
            <div className="form-group mb-3">
              <label htmlFor="reason">Contamination Reason</label>
              <select
                id="reason"
                name="reason"
                className="form-select"
                value={formData.reason}
                onChange={handleChange}
                required
              >
                <option value="MOLD">Mold</option>
                <option value="BACTERIA">Bacteria</option>
                <option value="TEMPERATURE">Temperature</option>
                <option value="HUMIDITY">Humidity</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || (formData.successful === 0 && formData.contaminated === 0)}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GrowthUpdateForm;
