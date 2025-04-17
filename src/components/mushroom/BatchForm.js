import React, { useState } from 'react';
import { createBatch } from '../../api/batchApi';

const BatchForm = ({ onBatchCreated }) => {
  const [formData, setFormData] = useState({
    type: 'OYSTER',
    initialQuantity: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initialQuantity' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await createBatch(formData);
      
      setSuccess('Mushroom batch created successfully');
      setFormData({
        type: 'OYSTER',
        initialQuantity: 100
      });
      
      if (onBatchCreated) {
        onBatchCreated();
      }
    } catch (err) {
      console.error('Error creating batch:', err);
      setError(err.response?.data?.message || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Log New Batch</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="type">Mushroom Type</label>
            <select
              id="type"
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="OYSTER">Oyster</option>
              <option value="SHIITAKE">Shiitake</option>
              <option value="PORTOBELLO">Portobello</option>
              <option value="MAITAKE">Maitake</option>
              <option value="LIONS_MANE">Lion's Mane</option>
            </select>
          </div>
          
          <div className="form-group mb-3">
            <label htmlFor="initialQuantity">Initial Quantity</label>
            <input
              type="number"
              id="initialQuantity"
              name="initialQuantity"
              className="form-control"
              value={formData.initialQuantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Batch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BatchForm;
