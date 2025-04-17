import React, { useState, useEffect } from 'react';
import { getInventoryItems } from '../../api/inventoryApi';

const MaterialOverview = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-4">Loading materials data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Raw Material Overview</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Material</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className={material.quantity <= material.thresholdLevel ? 'table-danger' : ''}>
                  <td>{material.materialType}</td>
                  <td>{material.quantity}</td>
                  <td>
                    {material.quantity <= material.thresholdLevel ? (
                      <span className="badge bg-danger">Low Stock</span>
                    ) : (
                      <span className="badge bg-success">In Stock</span>
                    )}
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">No materials found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaterialOverview;
