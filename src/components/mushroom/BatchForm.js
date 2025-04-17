import React, { useState } from 'react';
import { createBatch } from '../../api/batchApi';

const BatchForm = ({ onBatchCreated }) => {
  const [formData, setFormData] = useState({
    type: 'OYSTER',
    initialQuantity: 100,
    substrate: 'STRAW',
    location: 'MAIN_ROOM',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(1); 

  const mushroomInfo = {
    OYSTER: "Fast-growing, great for beginners. Prefers straw or wood-based substrates.",
    SHIITAKE: "Requires more time but produces high yield. Thrives on hardwood.",
    PORTOBELLO: "Mature version of crimini. Grows well on compost-based substrates.",
    MAITAKE: "Medicinal mushroom that prefers hardwood sawdust mixtures.",
    LIONS_MANE: "Medicinal with unique growth pattern. Best on sawdust or hardwood.",
    REISHI: "Slow-growing medicinal mushroom. Prefers hardwood substrates.",
    ENOKI: "Grows in clusters, requires cooler temperatures. Prefers sawdust.",
    CORDYCEPS: "Specialized medicinal mushroom. Requires grain or specialized media."
  };

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
      
      const response = await createBatch(formData);
      
      setSuccess('Mushroom batch created successfully!');
      setFormData({
        type: 'OYSTER',
        initialQuantity: 100,
        substrate: 'STRAW',
        location: 'MAIN_ROOM',
        notes: '',
      });
      
      setTimeout(() => {
        if (onBatchCreated) {
          onBatchCreated(response.data);
        }
      }, 1500);
      
    } catch (err) {
      console.error('Error creating batch:', err);
      setError(err.response?.data?.message || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  return (
    <div className="batch-form-container">
      {success && (
        <div className="alert alert-success d-flex align-items-center success-animation" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-4"></i>
          <div className="flex-grow-1">{success}</div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="progress mb-4" style={{height: "6px"}}>
          <div 
            className="progress-bar bg-primary" 
            role="progressbar" 
            style={{width: step === 1 ? "50%" : "100%"}}
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
        
        <div className="form-step-container">
          <div className={`form-step ${step === 1 ? 'active' : 'hidden'}`}>
            <h4 className="mb-4 text-primary">
              <i className="bi bi-1-circle me-2"></i>
              Basic Batch Information
            </h4>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="type" className="form-label fw-bold">
                    <i className="bi bi-mushroom me-2 text-success"></i>
                    Mushroom Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="form-select form-select-lg"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    {Object.keys(mushroomInfo).map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').split('_').map(word => 
                          word.charAt(0) + word.slice(1).toLowerCase()
                        ).join(' ')}
                      </option>
                    ))}
                  </select>
                  <div className="form-text mt-2">
                    <i className="bi bi-info-circle me-1"></i>
                    {mushroomInfo[formData.type]}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="initialQuantity" className="form-label fw-bold">
                    <i className="bi bi-123 me-2 text-primary"></i>
                    Initial Quantity
                  </label>
                  <div className="input-group input-group-lg">
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
                    <span className="input-group-text">units</span>
                  </div>
                  <div className="form-text">
                    Number of cultivation units (bags, jars, blocks) in this batch
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={nextStep}
              >
                Next Step
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>

          <div className={`form-step ${step === 2 ? 'active' : 'hidden'}`}>
            <h4 className="mb-4 text-primary">
              <i className="bi bi-2-circle me-2"></i>
              Growing Environment Details
            </h4>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="substrate" className="form-label fw-bold">
                    <i className="bi bi-layers me-2 text-warning"></i>
                    Substrate
                  </label>
                  <select
                    id="substrate"
                    name="substrate"
                    className="form-select form-select-lg"
                    value={formData.substrate}
                    onChange={handleChange}
                    required
                  >
                    <option value="STRAW">Straw</option>
                    <option value="SAWDUST">Sawdust</option>
                    <option value="COCO_COIR">Coconut Coir</option>
                    <option value="HARDWOOD">Hardwood</option>
                    <option value="BRF">Brown Rice Flour (BRF)</option>
                    <option value="COMPOST">Compost</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <div className="form-text">
                    The growing medium used for this mushroom batch
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="location" className="form-label fw-bold">
                    <i className="bi bi-geo-alt me-2 text-danger"></i>
                    Growth Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    className="form-select form-select-lg"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="MAIN_ROOM">Main Growth Room</option>
                    <option value="INCUBATION">Incubation Room</option>
                    <option value="FRUITING_CHAMBER">Fruiting Chamber</option>
                    <option value="GREENHOUSE">Greenhouse</option>
                    <option value="BASEMENT">Basement</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <div className="form-text">
                    Where this batch will be grown in your facility
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group mt-4">
              <label htmlFor="notes" className="form-label fw-bold">
                <i className="bi bi-journal-text me-2 text-info"></i>
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                rows="4"
                placeholder="Record any special conditions, treatments, or observations..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
              <div className="form-text">
                Optional: Add any details that might be useful for tracking this batch
              </div>
            </div>
            
            <div className="d-flex justify-content-between mt-4">
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-lg"
                onClick={prevStep}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
              
              <button 
                type="submit" 
                className="btn btn-success btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Batch...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Create Batch
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      <style jsx>{`
        .form-step {
          transition: all 0.3s ease;
          animation: fadeInStep 0.4s;
        }
        
        .form-step.hidden {
          display: none;
        }
        
        .success-animation {
          animation: successPulse 2s;
        }
        
        @keyframes fadeInStep {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes successPulse {
          0% { transform: scale(1); }
          10% { transform: scale(1.05); }
          20% { transform: scale(1); }
        }
        
        .batch-form-container {
          position: relative;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }
      `}</style>
    </div>
  );
};

export default BatchForm;
