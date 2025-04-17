import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getContaminationData } from '../../api/dashboardApi';

const ContaminationChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getContaminationData();
        
        const data = {
          labels: response.data.labels,
          datasets: [
            {
              data: response.data.values,
              backgroundColor: [
                '#ef4444',
                '#f59e0b',
                '#10b981',
                '#3b82f6',
                '#8b5cf6'
              ],
              borderWidth: 1,
            },
          ],
        };
        
        setChartData(data);
      } catch (err) {
        console.error('Error fetching contamination data:', err);
        setError('Failed to load contamination data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-4">Loading chart data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!chartData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Contamination by Reason',
      },
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Contamination Analysis</h5>
      </div>
      <div className="card-body">
        <div className="chart-container">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ContaminationChart;
