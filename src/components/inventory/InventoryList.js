import React, { useState, useEffect } from 'react';
import { getInventoryItems, updateInventoryItem } from '../../api/inventoryApi';
import { FaEdit, FaSave, FaTimes, FaBoxes, FaExclamationTriangle, FaSearch, FaSync, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'materialType', direction: 'asc' });
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await getInventoryItems();
      setInventory(response.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInventory();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditQuantity(item.quantity);
  };

  const handleCancel = () => {
    setEditItem(null);
    setEditQuantity(0);
  };

  const handleUpdate = async () => {
    try {
      await updateInventoryItem(editItem.id, {
        quantity: editQuantity,
        thresholdLevel: editItem.thresholdLevel
      });
      fetchInventory();
      setEditItem(null);
    } catch (err) {
      console.error('Error updating inventory:', err);
      setError('Failed to update inventory');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? 
        <FaSortAmountUp size={12} className="ms-1" /> : 
        <FaSortAmountDown size={12} className="ms-1" />;
    }
    return null;
  };

  const sortedInventory = [...inventory].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredInventory = sortedInventory
    .filter(item => {
      if (filterStatus === 'low') {
        return item.quantity <= item.thresholdLevel;
      }
      if (filterStatus === 'in-stock') {
        return item.quantity > item.thresholdLevel;
      }
      return true;
    })
    .filter(item => {
      return item.materialType.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const getStatusPercentage = (current, threshold) => {
    const percentage = (current / (threshold * 2)) * 100;
    return Math.min(percentage, 100);
  };

  const lowStockCount = inventory.filter(item => item.quantity <= item.thresholdLevel).length;
  const inStockCount = inventory.filter(item => item.quantity > item.thresholdLevel).length;

  return (
    <div className="card shadow border-0 h-100 px-3">
      <div className="card-header bg-white border-0 py-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h5 className="mb-0 d-flex align-items-center">
            <FaBoxes className="me-2" style={{ color: '#3498db' }} />
            Lab Inventory
          </h5>
          
          <div className="d-flex flex-column flex-sm-row gap-2">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              className="btn btn-outline-primary d-flex align-items-center justify-content-center"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FaSync className={refreshing ? "me-2 fa-spin" : "me-2"} />
              <span className="d-none d-sm-inline">Refresh</span>
            </button>
          </div>
        </div>
        
        <div className="mt-3 d-flex justify-content-center">
          <div className="btn-group" role="group" aria-label="Filter inventory">
            <button 
              className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilterStatus('all')}
            >
              All <span className="badge bg-white text-primary ms-1">{inventory.length}</span>
            </button>
            <button 
              className={`btn ${filterStatus === 'low' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilterStatus('low')}
            >
              Low Stock <span className="badge bg-white text-danger ms-1">{lowStockCount}</span>
            </button>
            <button 
              className={`btn ${filterStatus === 'in-stock' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterStatus('in-stock')}
            >
              In Stock <span className="badge bg-white text-success ms-1">{inStockCount}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {error && (
          <div className="alert alert-danger d-flex align-items-center m-3">
            <FaExclamationTriangle className="me-2" />
            {error}
            <button 
              className="ms-auto btn-close"
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading inventory...</span>
            </div>
            <p className="mt-3 text-muted">Loading inventory data...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="user-select-none" onClick={() => handleSort('materialType')} style={{ cursor: 'pointer' }}>
                    Material {getSortIcon('materialType')}
                  </th>
                  <th className="user-select-none" onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                    Quantity {getSortIcon('quantity')}
                  </th>
                  <th className="user-select-none" onClick={() => handleSort('thresholdLevel')} style={{ cursor: 'pointer' }}>
                    Threshold {getSortIcon('thresholdLevel')}
                  </th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr 
                    key={item.id} 
                    className={item.quantity <= item.thresholdLevel ? 'table-danger bg-opacity-25' : ''}
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <td className="fw-medium">{item.materialType}</td>
                    <td>
                      {editItem && editItem.id === item.id ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(parseInt(e.target.value, 10) || 0)}
                          min="0"
                          autoFocus
                        />
                      ) : (
                        <div className="d-flex flex-column">
                          <span className="fw-bold">{item.quantity}</span>
                          <div className="progress mt-1" style={{ height: '6px' }}>
                            <div 
                              className={`progress-bar ${
                                item.quantity <= item.thresholdLevel / 2 ? 'bg-danger' :
                                item.quantity <= item.thresholdLevel ? 'bg-warning' : 'bg-success'
                              }`}
                              role="progressbar"
                              style={{ 
                                width: `${getStatusPercentage(item.quantity, item.thresholdLevel)}%`,
                                transition: 'width 0.5s ease'
                              }}
                              aria-valuenow={item.quantity}
                              aria-valuemin="0" 
                              aria-valuemax={item.thresholdLevel * 2}>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>{item.thresholdLevel}</td>
                    <td>
                      {item.quantity <= item.thresholdLevel / 2 ? (
                        <span className="badge bg-danger rounded-pill d-flex align-items-center" style={{ width: 'fit-content' }}>
                          <FaExclamationTriangle className="me-1" />
                          Critical
                        </span>
                      ) : item.quantity <= item.thresholdLevel ? (
                        <span className="badge bg-warning text-dark rounded-pill d-flex align-items-center" style={{ width: 'fit-content' }}>
                          <FaExclamationTriangle className="me-1" />
                          Low
                        </span>
                      ) : (
                        <span className="badge bg-success rounded-pill d-flex align-items-center" style={{ width: 'fit-content' }}>
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      {editItem && editItem.id === item.id ? (
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={handleUpdate}
                            title="Save"
                          >
                            <FaSave />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleCancel}
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(item)}
                          title="Edit quantity"
                        >
                          <FaEdit className="me-1" /> Update
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      {searchTerm ? (
                        <>
                          <div className="mb-3"><FaSearch size={30} opacity={0.5} /></div>
                          <h6>No materials matching "{searchTerm}"</h6>
                          <p className="small mb-0">Try adjusting your search or filter criteria</p>
                        </>
                      ) : (
                        <>
                          <div className="mb-3"><FaBoxes size={30} opacity={0.5} /></div>
                          <h6>No {filterStatus !== 'all' ? (filterStatus === 'low' ? 'low stock' : 'in-stock') : ''} inventory items found</h6>
                          <p className="small mb-0">
                            {filterStatus !== 'all' ? 'Try changing your filter selection' : 'Add inventory items to get started'}
                          </p>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 py-3">
        <div className="d-flex gap-3 align-items-center">
          <span className="text-muted">Total: <strong>{filteredInventory.length}</strong> items</span>
          {lowStockCount > 0 && (
            <span className="text-danger d-flex align-items-center">
              <FaExclamationTriangle className="me-1" /> 
              <strong>{lowStockCount}</strong> items below threshold
            </span>
          )}
        </div>
        {searchTerm && (
          <span className="badge bg-info text-white">
            Filtered by: "{searchTerm}"
            <button className="btn-close btn-close-white ms-2" style={{ fontSize: '0.6rem' }} onClick={() => setSearchTerm('')}></button>
          </span>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
