import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/dashboardApi';
import StatCard from '../components/dashboard/StatCard';
import GrowthStatusChart from '../components/dashboard/GrowthStatusChart';
import ContaminationChart from '../components/dashboard/ContaminationChart';
import MaterialOverview from '../components/dashboard/MaterialOverview';
import StockAlert from '../components/inventory/StockAlert';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-5">Loading dashboard...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return null;

  return (
    <div className="container">
      <h1 className="mb-4">Lab Dashboard</h1>
      
      <StockAlert />
      
      <div className="dashboard-row">
        <StatCard 
          title="Active Batches" 
          value={stats.activeBatchCount}
          icon="🍄"
          color="#7c3aed"
        />
        <StatCard 
          title="Success Rate" 
          value={`${stats.overallSuccessRate.toFixed(1)}%`}
          icon="📈"
          color="#10b981"
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats.lowStockItems.length}
          icon="⚠️"
          color="#f59e0b"
        />
        <StatCard 
          title="Production Ready" 
          value={stats.productionReadyCount}
          icon="📦"
          color="#3b82f6"
        />
      </div>
      
      <div className="row mb-4">
        <div className="col-md-8">
          <GrowthStatusChart />
        </div>
        <div className="col-md-4">
          <ContaminationChart />
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <MaterialOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
