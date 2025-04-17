import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { getGrowthStatusData } from '../../api/dashboardApi';

const GrowthStatusChart = () => {
  const [chartData, setChartData] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const chartRef = useRef(null);

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
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 8,
              pointBackgroundColor: '#10b981',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              fill: true,
            },
            {
              label: 'Contaminated',
              data: response.data.contaminated,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 8,
              pointBackgroundColor: '#ef4444',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              fill: true,
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
    setHighlightedIndex(null);
  };

  if (loading) return (
    <div className="text-center py-4 d-flex flex-column align-items-center">
      <div className="loading-spinner mb-3"></div>
      <p className="text-muted">Loading growth status data...</p>
    </div>
  );
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!chartData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          boxWidth: 10,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        bodySpacing: 10,
        padding: 12,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value}`;
          },
          afterLabel: function(context) {
            if (context.datasetIndex === 0) { 
              const successValue = chartData.datasets[0].data[context.dataIndex];
              const contaminatedValue = chartData.datasets[1].data[context.dataIndex];
              const total = successValue + contaminatedValue;
              const successRate = total > 0 ? ((successValue / total) * 100).toFixed(1) : 0;
              return `Success Rate: ${successRate}%`;
            }
            return null;
          }
        }
      },
      title: {
        display: true,
        text: `${period === 'monthly' ? 'Monthly' : 'Daily'} Growth Status`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 15
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
          font: {
            size: 13,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    onHover: (event, elements) => {
      if (elements && elements.length) {
        setHighlightedIndex(elements[0].index);
      } else {
        setHighlightedIndex(null);
      }
    }
  };

  const animationKey = `growth-chart-${period}-${Math.random()}`;

  let successTotal = 0;
  let contaminatedTotal = 0;
  let successRate = 0;

  if (highlightedIndex !== null) {
    successTotal = chartData.datasets[0].data[highlightedIndex];
    contaminatedTotal = chartData.datasets[1].data[highlightedIndex];
  } else {
    successTotal = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
    contaminatedTotal = chartData.datasets[1].data.reduce((a, b) => a + b, 0);
  }

  const total = successTotal + contaminatedTotal;
  successRate = total > 0 ? ((successTotal / total) * 100).toFixed(1) : 0;

  return (
    <div className="card chart-card shadow-sm rounded-3 border-0 overflow-hidden">
      <div className="card-header bg-light bg-gradient d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 fw-bold">Growth Status</h5>
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${period === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePeriodChange('daily')}
          >
            <i className="bi bi-calendar-day me-1"></i>
            Daily
          </button>
          <button 
            className={`btn btn-sm ${period === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePeriodChange('monthly')}
          >
            <i className="bi bi-calendar-month me-1"></i>
            Monthly
          </button>
        </div>
      </div>
      <div className="card-body position-relative">
        <div className="row mb-3">
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center flex-column p-2 rounded-3 bg-light bg-opacity-50 h-100">
              <div className="text-muted mb-1">Success Rate</div>
              <div className="fs-3 fw-bold text-success">{successRate}%</div>
              <div className="text-muted small">
                {highlightedIndex !== null ? chartData.labels[highlightedIndex] : 'Overall'}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center flex-column p-2 rounded-3 bg-success bg-opacity-10 h-100">
              <div className="text-muted mb-1">Successful</div>
              <div className="fs-3 fw-bold text-success">{successTotal}</div>
              <div className="text-muted small">
                {highlightedIndex !== null ? chartData.labels[highlightedIndex] : 'Total'}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center flex-column p-2 rounded-3 bg-danger bg-opacity-10 h-100">
              <div className="text-muted mb-1">Contaminated</div>
              <div className="fs-3 fw-bold text-danger">{contaminatedTotal}</div>
              <div className="text-muted small">
                {highlightedIndex !== null ? chartData.labels[highlightedIndex] : 'Total'}
              </div>
            </div>
          </div>
        </div>
        <div className="chart-container animation-fade-in" style={{ height: '320px' }}>
          <Line 
            data={chartData} 
            options={options} 
            key={animationKey} 
            ref={chartRef}
          />
        </div>
        <div className="position-absolute bottom-0 end-0 p-2 text-muted small">
          <i className="bi bi-info-circle me-1"></i>
          Hover over chart to see details
        </div>
      </div>
    </div>
  );
};

export default GrowthStatusChart;
