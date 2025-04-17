import React, { useState, useEffect } from 'react';
import { getInventoryItems } from '../../api/inventoryApi';

const MaterialOverview = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('materialType');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getInventoryItems();
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to load materials data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <i className="bi bi-arrow-down-up text-muted opacity-50"></i>;
    return sortDirection === 'asc' ? 
      <i className="bi bi-sort-down-alt text-primary"></i> : 
      <i className="bi bi-sort-down text-primary"></i>;
  };

  const processedMaterials = [...materials]
    .filter(material => 
      material.materialType.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterStatus === 'all' || 
       (filterStatus === 'low' && material.quantity <= material.thresholdLevel) ||
       (filterStatus === 'in-stock' && material.quantity > material.thresholdLevel))
    )
    .sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) return (
    <div className="text-center py-5 d-flex flex-column align-items-center bg-light rounded-4">
      <div className="position-relative" style={{width: "60px", height: "60px"}}>
        <div className="spinner-grow text-primary position-absolute" style={{width: "30px", height: "30px", left: "15px", top: "15px", opacity: "0.7", animationDuration: "1s"}} role="status"></div>
        <div className="spinner-border text-secondary position-absolute" style={{width: "60px", height: "60px", left: "0", top: "0", opacity: "0.5", animationDuration: "1.5s"}} role="status"></div>
      </div>
      <p className="text-muted mt-3 fw-light">Loading materials inventory...</p>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-danger border-0 shadow-sm rounded-4 d-flex align-items-center" role="alert">
      <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
      <div>{error}</div>
      <button onClick={fetchData} className="btn btn-sm btn-outline-danger ms-auto rounded-pill px-3">
        <i className="bi bi-arrow-clockwise me-1"></i>Retry
      </button>
    </div>
  );

  const totalItems = materials.length;
  const lowStockItems = materials.filter(m => m.quantity <= m.thresholdLevel).length;
  const inStockPercentage = totalItems > 0 ? ((totalItems - lowStockItems) / totalItems * 100).toFixed(1) : 0;

  return (
    <div className="material-overview">
      <div className="row mb-4">
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="card border-0 shadow-sm rounded-4 bg-gradient h-100" style={{background: "linear-gradient(145deg, #ffffff, #f0f4f8)"}}>
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <i className="bi bi-box-seam text-primary fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Materials</h6>
                <h4 className="mb-0">{totalItems}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="card border-0 shadow-sm rounded-4 bg-gradient h-100" style={{background: "linear-gradient(145deg, #ffffff, #f0f4f8)"}}>
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                <i className="bi bi-exclamation-triangle text-danger fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">Low Stock Items</h6>
                <h4 className="mb-0">{lowStockItems}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 bg-gradient h-100" style={{background: "linear-gradient(145deg, #ffffff, #f0f4f8)"}}>
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <i className="bi bi-check-circle text-success fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1">In Stock</h6>
                <h4 className="mb-0">{inStockPercentage}%</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Search materials..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary border-start-0" 
                    type="button"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end">
                <div className="btn-group" role="group">
                  <button 
                    type="button" 
                    className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${filterStatus === 'low' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterStatus('low')}
                  >
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> Low Stock
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${filterStatus === 'in-stock' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterStatus('in-stock')}
                  >
                    <i className="bi bi-check-circle-fill me-1"></i> In Stock
                  </button>
                </div>
                <button className="btn btn-light ms-2" onClick={() => window.print()}>
                  <i className="bi bi-printer"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr className="bg-light">
                  <th className="border-0 py-3 ps-4" style={{cursor: 'pointer'}} onClick={() => handleSort('materialType')}>
                    <div className="d-flex align-items-center">
                      Material {getSortIcon('materialType')}
                    </div>
                  </th>
                  <th className="border-0 py-3" style={{cursor: 'pointer'}} onClick={() => handleSort('quantity')}>
                    <div className="d-flex align-items-center">
                      Quantity {getSortIcon('quantity')}
                    </div>
                  </th>
                  <th className="border-0 py-3">Status</th>
                  <th className="border-0 py-3">Usage Trend</th>
                  <th className="border-0 py-3 text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedMaterials.map((material, index) => (
                  <tr key={material.id} className="align-middle" style={{ 
                    animationDelay: `${0.05 * index}s`,
                    animation: 'fadeIn 0.5s ease-in-out forwards'
                  }}>
                    <td className="ps-4">
                      <div className="fw-semibold text-dark">{material.materialType}</div>
                      <small className="text-muted">{material.category || 'General'}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div className="fw-semibold">{material.quantity}</div>
                          <small className="text-muted">Min: {material.thresholdLevel}</small>
                        </div>
                        <div className="flex-grow-1" style={{maxWidth: '150px'}}>
                          <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                            <div 
                              className="progress-bar" 
                              role="progressbar" 
                              style={{ 
                                width: `${Math.min(material.quantity / material.thresholdLevel * 100, 100)}%`,
                                backgroundColor: material.quantity <= material.thresholdLevel ? '#ef4444' : 
                                  material.quantity < material.thresholdLevel * 1.5 ? '#f59e0b' : '#10b981',
                                borderRadius: '4px'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {material.quantity <= material.thresholdLevel ? (
                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                          <i className="bi bi-exclamation-triangle-fill me-1"></i>
                          Low Stock
                        </span>
                      ) : material.quantity < material.thresholdLevel * 1.5 ? (
                        <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">
                          <i className="bi bi-exclamation-circle-fill me-1"></i>
                          Medium
                        </span>
                      ) : (
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          In Stock
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ width: '120px', height: '40px', display: 'inline-block' }}>
                        <svg width="100%" height="100%" viewBox="0 0 120 40">
                          <defs>
                            <linearGradient id={`gradient-${material.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" style={{ stopColor: material.quantity <= material.thresholdLevel ? '#ef4444' : '#10b981', stopOpacity: 0.2 }} />
                              <stop offset="100%" style={{ stopColor: material.quantity <= material.thresholdLevel ? '#ef4444' : '#10b981', stopOpacity: 0 }} />
                            </linearGradient>
                          </defs>
                          {(() => {
                            const points = [];
                            const values = [];
                            const pointCount = 6;
                            const baseValue = 20 - Math.random() * 10;
                            
                            for (let i = 0; i < pointCount; i++) {
                              const value = baseValue + (Math.sin(i / (pointCount - 1) * Math.PI) * 15) + (Math.random() * 5 - 2.5);
                              values.push(value);
                              points.push(`${(i / (pointCount - 1)) * 120},${40 - value}`);
                            }
                            
                            const pointsString = points.join(' ');
                            const areaPoints = `${pointsString} ${120},40 0,40`;
                            
                            return (
                              <>
                                <path 
                                  d={`M${areaPoints}Z`} 
                                  fill={`url(#gradient-${material.id})`} 
                                />
                                <polyline
                                  points={pointsString}
                                  fill="none"
                                  stroke={material.quantity <= material.thresholdLevel ? '#ef4444' : '#10b981'}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                {values.map((value, i) => (
                                  <circle
                                    key={i}
                                    cx={(i / (pointCount - 1)) * 120}
                                    cy={40 - value}
                                    r="3"
                                    fill="#fff"
                                    stroke={material.quantity <= material.thresholdLevel ? '#ef4444' : '#10b981'}
                                    strokeWidth="1.5"
                                  />
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-primary">
                        <i className="bi bi-plus-lg"></i> Order
                      </button>
                    </td>
                  </tr>
                ))}
                {processedMaterials.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="py-4">
                        <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                        <h5>No materials found</h5>
                        <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
                        <button className="btn btn-outline-primary mt-3" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer border-0 bg-light p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="small text-muted">
              Showing {processedMaterials.length} of {materials.length} items
            </div>
            <button className="btn btn-sm btn-primary">
              <i className="bi bi-cloud-download me-1"></i> Export Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialOverview;
