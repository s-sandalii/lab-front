import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getGrowthStatusData } from '../../api/dashboardApi';

const GrowthStatusChart = () => {
  const [chartData, setChartData] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getGrowthStatusData(period);
        
        const data = {
          labels: response.data.labels,
          datasets: [
            {
              label: 'Successful Growth',
              data: response.data.successful,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
            },
            {
              label: 'Contaminated',
              data: response.data.contaminated,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
            }
          ]
        };
        
        setChartData(data);
      } catch (err) {
        console.error('Error fetching growth status data:', err);
        setError('Failed to load growth status data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  if (loading) return <div className="text-center py-4">Loading chart data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!chartData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${period === 'monthly' ? 'Monthly' : 'Daily'} Growth Status`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Growth Status</h5>
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${period === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePeriodChange('daily')}
          >
            Daily
          </button>
          <button 
            className={`btn btn-sm ${period === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePeriodChange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="chart-container">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default GrowthStatusChart;
