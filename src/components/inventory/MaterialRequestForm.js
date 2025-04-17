import React, { useState } from 'react';
import { requestMaterials } from '../../api/inventoryApi';
import { FaBoxOpen, FaCheck, FaExclamationCircle, FaPaperPlane, FaUndoAlt, FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

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

  const handleReset = () => {
    setFormData({
      materialType: 'SEED',
      quantity: 100,
      urgency: 'NORMAL',
      notes: ''
    });
    setError(null);
    setSuccess(null);
  };

  const getUrgencyBadgeClass = (urgency) => {
    switch(urgency) {
      case 'LOW': return 'bg-info';
      case 'NORMAL': return 'bg-primary';
      case 'HIGH': return 'bg-warning';
      case 'CRITICAL': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };
  
  const getQuantityUnit = (materialType) => {
    switch(materialType) {
      case 'SEED': return 'packets';
      case 'COTTON': return 'rolls';
      case 'POLYTHENE_BAG': return 'pieces';
      case 'NUTRIENT_MIX': return 'kg';
      case 'STERILIZER': return 'liters';
      default: return 'units';
    }
  };

  const renderTooltip = (text) => (
    <Tooltip>{text}</Tooltip>
  );

  return (
    <div className="card shadow border-0 mb-4 rounded-3 overflow-hidden">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex align-items-center">
          <div className="icon-circle bg-white bg-opacity-25 rounded-circle p-2 me-3">
            <FaBoxOpen size={24} className="text-black" />
          </div>
          <h5 className="mb-0 fw-bold text-black">Request Materials</h5>
        </div>
      </div>
      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger d-flex align-items-center fade show animate__animated animate__fadeIn">
            <div className="bg-danger bg-opacity-25 p-2 rounded-circle me-3">
              <FaExclamationCircle className="text-danger" />
            </div>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success d-flex align-items-center fade show animate__animated animate__fadeIn">
            <div className="bg-success bg-opacity-25 p-2 rounded-circle me-3">
              <FaCheck className="text-success" />
            </div>
            <span>{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="needs-validation">
          <div className="row g-4">
            <div className="col-md-6 mb-3">
              <label htmlFor="materialType" className="form-label fw-medium">Material Type</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light"><FaBoxOpen /></span>
                <select
                  id="materialType"
                  name="materialType"
                  className="form-select form-select-lg border-start-0"
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
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="quantity" className="form-label fw-medium d-flex align-items-center">
                Quantity
                <OverlayTrigger placement="top" overlay={renderTooltip(`Enter amount in ${getQuantityUnit(formData.materialType)}`)}>
                  <span className="ms-2 text-muted"><FaInfoCircle size={14} /></span>
                </OverlayTrigger>
              </label>
              <div className="input-group input-group-lg">
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
                <span className="input-group-text bg-light">{getQuantityUnit(formData.materialType)}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="urgency" className="form-label fw-medium">Urgency Level</label>
            <div className="urgency-selector d-flex flex-wrap gap-2">
              {['LOW', 'NORMAL', 'HIGH', 'CRITICAL'].map(urgencyLevel => (
                <div key={urgencyLevel} className="urgency-option">
                  <input
                    type="radio"
                    className="btn-check"
                    name="urgency"
                    id={`urgency-${urgencyLevel}`}
                    value={urgencyLevel}
                    checked={formData.urgency === urgencyLevel}
                    onChange={handleChange}
                  />
                  <label 
                    className={`btn ${formData.urgency === urgencyLevel ? 'btn-' : 'btn-outline-'}${
                      urgencyLevel === 'LOW' ? 'info' :
                      urgencyLevel === 'NORMAL' ? 'primary' :
                      urgencyLevel === 'HIGH' ? 'warning' : 'danger'
                    } px-4 py-2`} 
                    htmlFor={`urgency-${urgencyLevel}`}
                  >
                    <span className={`badge ${getUrgencyBadgeClass(urgencyLevel)} me-2`}></span>
                    {urgencyLevel.charAt(0) + urgencyLevel.slice(1).toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="form-label fw-medium d-flex align-items-center">
              Additional Notes
              <OverlayTrigger placement="top" overlay={renderTooltip("Include any special instructions or requirements")}>
                <span className="ms-2 text-muted"><FaInfoCircle size={14} /></span>
              </OverlayTrigger>
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-control border-secondary-subtle"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Enter any specific requirements or details about your request"
            ></textarea>
          </div>
          
          <div className="d-flex gap-3 mt-4">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg flex-grow-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing Request...
                </>
              ) : (
                <>
                  <FaPaperPlane className="me-2" />
                  Submit Request
                </>
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-lg"
              onClick={handleReset}
              disabled={loading}
            >
              <FaUndoAlt className="me-1" />
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialRequestForm;
