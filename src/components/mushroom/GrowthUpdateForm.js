import React, { useState } from 'react';
import { updateBatchProgress } from '../../api/batchApi';
import { toast } from 'react-toastify';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Modal from 'react-bootstrap/Modal';

const GrowthUpdateForm = ({ batch, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    successful: 0,
    contaminated: 0,
    reason: 'MOLD',
    notes: '',
    updateDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [touched, setTouched] = useState({});

  const remainingQuantity = batch.initialQuantity - (batch.successfulCount + batch.contaminatedCount);
  const successRate = batch.initialQuantity > 0 ? 
    ((batch.successfulCount / batch.initialQuantity) * 100).toFixed(1) : 0;
  const contaminationRate = batch.initialQuantity > 0 ? 
    ((batch.contaminatedCount / batch.initialQuantity) * 100).toFixed(1) : 0;
  const daysRunning = Math.ceil((new Date() - new Date(batch.startDate)) / (1000 * 60 * 60 * 24));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFormData(prev => ({
      ...prev,
      [name]: name === 'successful' || name === 'contaminated' ? parseInt(value, 10) || 0 : value
    }));
  };

  const validateForm = () => {
    const newSuccessful = formData.successful;
    const newContaminated = formData.contaminated;
    
    if (newSuccessful + newContaminated > remainingQuantity) {
      setError("Combined total exceeds remaining units");
      return false;
    }
    
    if (newSuccessful === 0 && newContaminated === 0) {
      setError("You must enter at least one successful or contaminated unit");
      return false;
    }
    
    if (newContaminated > 0 && !formData.reason) {
      setError("Please select a contamination reason");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (formData.successful + formData.contaminated >= 5) {
        setShowConfirmation(true); 
      } else {
        submitUpdate();
      }
    }
  };

  const submitUpdate = async () => {
    setShowConfirmation(false);
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await updateBatchProgress(batch.id, formData);
      
      setSuccess('Growth updated successfully');
      toast.success('Batch progress updated successfully');
      
      setFormData({
        successful: 0,
        contaminated: 0,
        reason: 'MOLD',
        notes: '',
        updateDate: new Date().toISOString().split('T')[0]
      });
      
      setTimeout(() => {
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      }, 1000);
    } catch (err) {
      console.error('Error updating growth:', err);
      setError(err.response?.data?.message || 'Failed to update growth');
      toast.error('Failed to update batch progress');
    } finally {
      setLoading(false);
    }
  };

  const getInputValidationClass = (field) => {
    if (!touched[field]) return '';
    return formData[field] >= 0 ? 'is-valid' : 'is-invalid';
  };

  const renderTooltip = (content) => (
    <Tooltip id="button-tooltip">
      {content}
    </Tooltip>
  );

  return (
    <div className="card shadow">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Update Growth Status</h5>
          <div>
            <span className="badge bg-secondary me-2">Running: {daysRunning} days</span>
            {onCancel && (
              <button className="btn btn-sm btn-outline-secondary" onClick={onCancel}>
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="mb-4 p-3 border rounded bg-light">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-1"><i className="bi bi-fungi me-2"></i><strong>Type:</strong> {batch.type}</p>
              <p className="mb-1"><i className="bi bi-upc me-2"></i><strong>ID:</strong> {batch.id}</p>
              <p className="mb-0"><i className="bi bi-calendar me-2"></i><strong>Started:</strong> {new Date(batch.startDate).toLocaleDateString()}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1"><i className="bi bi-123 me-2"></i><strong>Initial Quantity:</strong> {batch.initialQuantity}</p>
              <p className="mb-1"><i className="bi bi-check-circle me-2 text-success"></i><strong>Success Rate:</strong> {successRate}% ({batch.successfulCount})</p>
              <p className="mb-0"><i className="bi bi-x-circle me-2 text-danger"></i><strong>Contamination Rate:</strong> {contaminationRate}% ({batch.contaminatedCount})</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6>Progress Tracking</h6>
            <h6>Remaining: <span className="badge bg-info">{remainingQuantity} units</span></h6>
          </div>
          <div className="progress mb-3" style={{ height: '30px' }}>
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${batch.successfulCount / batch.initialQuantity * 100}%` }}
              aria-valuenow={batch.successfulCount} 
              aria-valuemin="0" 
              aria-valuemax={batch.initialQuantity}
            >
              {batch.successfulCount > 0 ? `Successful: ${batch.successfulCount}` : ''}
            </div>
            <div 
              className="progress-bar bg-danger" 
              style={{ width: `${batch.contaminatedCount / batch.initialQuantity * 100}%` }}
              aria-valuenow={batch.contaminatedCount} 
              aria-valuemin="0" 
              aria-valuemax={batch.initialQuantity}
            >
              {batch.contaminatedCount > 0 ? `Contaminated: ${batch.contaminatedCount}` : ''}
            </div>
            <div 
              className="progress-bar bg-secondary" 
              style={{ width: `${(formData.successful + formData.contaminated) / batch.initialQuantity * 100}%`, opacity: 0.5 }}
              aria-valuenow={formData.successful + formData.contaminated} 
              aria-valuemin="0" 
              aria-valuemax={batch.initialQuantity}
            >
              {formData.successful + formData.contaminated > 0 ? `Pending: ${formData.successful + formData.contaminated}` : ''}
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label htmlFor="updateDate" className="form-label">Update Date</label>
                <input
                  type="date"
                  id="updateDate"
                  name="updateDate"
                  className="form-control"
                  value={formData.updateDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label htmlFor="successful" className="form-label">
                  <i className="bi bi-check-circle-fill text-success me-1"></i>
                  New Successful Growth
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-success text-white">
                    <i className="bi bi-check-circle"></i>
                  </span>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip('Number of units that have successfully grown since the last update')}
                  >
                    <input
                      type="number"
                      id="successful"
                      name="successful"
                      className={`form-control ${getInputValidationClass('successful')}`}
                      value={formData.successful}
                      onChange={handleChange}
                      min="0"
                      max={remainingQuantity}
                      required
                    />
                  </OverlayTrigger>
                  <span className="input-group-text">units</span>
                </div>
                <div className="form-text">
                  <i className="bi bi-info-circle me-1"></i>
                  Units that grew successfully since last update
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label htmlFor="contaminated" className="form-label">
                  <i className="bi bi-x-circle-fill text-danger me-1"></i>
                  New Contamination
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-danger text-white">
                    <i className="bi bi-exclamation-circle"></i>
                  </span>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip('Number of units that got contaminated since the last update')}
                  >
                    <input
                      type="number"
                      id="contaminated"
                      name="contaminated"
                      className={`form-control ${getInputValidationClass('contaminated')}`}
                      value={formData.contaminated}
                      onChange={handleChange}
                      min="0"
                      max={remainingQuantity - formData.successful}
                      required
                    />
                  </OverlayTrigger>
                  <span className="input-group-text">units</span>
                </div>
                <div className="form-text">
                  <i className="bi bi-info-circle me-1"></i>
                  Units that got contaminated since last update
                </div>
              </div>
            </div>
          </div>
          
          {formData.contaminated > 0 && (
            <div className="form-group mb-3 p-3 border rounded border-danger border-opacity-25 bg-light">
              <label htmlFor="reason" className="form-label">Contamination Reason</label>
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
                <option value="TEMPERATURE">Temperature Issue</option>
                <option value="HUMIDITY">Humidity Issue</option>
                <option value="PESTS">Pests/Insects</option>
                <option value="HANDLING">Improper Handling</option>
                <option value="OTHER">Other</option>
              </select>
              
              <div className="mt-3">
                <label htmlFor="photo" className="form-label">
                  <i className="bi bi-camera me-1"></i>
                  Documentation Photo (Optional)
                </label>
                <input 
                  type="file" 
                  className="form-control" 
                  id="photo" 
                  accept="image/*" 
                />
                <small className="form-text text-muted">
                  Upload a photo of the contamination for documentation
                </small>
              </div>
            </div>
          )}

          <div className="form-group mb-3">
            <label htmlFor="notes" className="form-label">
              <i className="bi bi-journal-text me-1"></i>
              Update Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              rows="3"
              placeholder="Observations, treatments applied, environmental conditions, etc."
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-4">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || (formData.successful === 0 && formData.contaminated === 0)}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Update Growth Status
                </>
              )}
            </button>
            
            <div className="text-muted">
              <span className="badge bg-secondary">
                <i className="bi bi-calculator me-1"></i>
                Remaining after update: {remainingQuantity - formData.successful - formData.contaminated} units
              </span>
            </div>
          </div>
        </form>
      </div>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Growth Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You're about to update:</p>
          <ul>
            <li><strong className="text-success">Successful:</strong> {formData.successful} units</li>
            <li><strong className="text-danger">Contaminated:</strong> {formData.contaminated} units</li>
          </ul>
          <p>This will leave {remainingQuantity - formData.successful - formData.contaminated} units remaining.</p>
          <p>Are you sure you want to proceed with this update?</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowConfirmation(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submitUpdate}>
            Confirm Update
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GrowthUpdateForm;
