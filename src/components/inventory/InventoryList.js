import React, { useState, useEffect } from 'react';
import { getInventoryItems, updateInventoryItem } from '../../api/inventoryApi';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);

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

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Lab Inventory</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <div className="text-center py-4">Loading inventory...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Quantity</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr 
                    key={item.id} 
                    className={item.quantity <= item.thresholdLevel ? 'table-danger' : ''}
                  >
                    <td>{item.materialType}</td>
                    <td>
                      {editItem && editItem.id === item.id ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(parseInt(e.target.value, 10))}
                          min="0"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td>{item.thresholdLevel}</td>
                    <td>
                      {item.quantity <= item.thresholdLevel ? (
                        <span className="badge bg-danger">Low Stock</span>
                      ) : (
                        <span className="badge bg-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      {editItem && editItem.id === item.id ? (
                        <>
                          <button 
                            className="btn btn-sm btn-success me-1"
                            onClick={handleUpdate}
                          >
                            Save
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(item)}
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {inventory.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">No inventory items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
