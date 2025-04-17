import React, { useState, useEffect } from 'react';
import { getLowStockAlerts } from '../../api/inventoryApi';

const StockAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await getLowStockAlerts();
        setAlerts(response.data);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Failed to load stock alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) return <div className="text-center py-4">Loading alerts...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (alerts.length === 0) return null;

  return (
    <div className="alert alert-warning">
      <h5>Low Stock Alerts</h5>
      <ul className="mb-0">
        {alerts.map((alert) => (
          <li key={alert.id}>
            <strong>{alert.materialType}</strong>: Only {alert.quantity} remaining (Threshold: {alert.thresholdLevel})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockAlert;
