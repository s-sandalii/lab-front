import React, { useState } from 'react';
import { requestMaterials } from '../../api/inventoryApi';

const MaterialRequestForm = () => {
  const [formData, setFormData] = useState({
    materialType: 'SEED',
    quantity: 100,
    urgency: 'NORMAL',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await requestMaterials(formData);
      
      setSuccess('Material request submitted successfully');
      setFormData({
        materialType: 'SEED',
        quantity: 100,
        urgency: 'NORMAL',
        notes: ''
      });
    } catch (err) {
      console.error('Error requesting materials:', err);
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Request Materials</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="materialType">Material Type</label>
            <select
              id="materialType"
              name="materialType"
              className="form-select"
              value={formData.materialType}
              onChange={handleChange}
              required
            >
              <option value="SEED">Seed</option>
              <option value="COTTON">Cotton</option>
              <option value="POLYTHENE_BAG">Polythene Bag</option>
              <option value="NUTRIENT_MIX">Nutrient Mix</option>
              <option value="STERILIZER">Sterilizer</option>
            </select>
          </div>
          
          <div className="form-group mb-3">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="form-control"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group mb-3">
            <label htmlFor="urgency">Urgency</label>
            <select
              id="urgency"
              name="urgency"
              className="form-select"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          
          <div className="form-group mb-3">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaterialRequestForm;
