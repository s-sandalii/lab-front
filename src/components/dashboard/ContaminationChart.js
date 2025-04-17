import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getContaminationData } from '../../api/dashboardApi';

const ContaminationChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

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
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverBorderWidth: 4,
              hoverBorderColor: '#ffffff',
              hoverOffset: 10,
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

  const toggleFullscreen = () => {
    const elem = document.getElementById('contamination-chart-container');
    
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) return (
    <div className="text-center py-4 d-flex flex-column align-items-center bg-light rounded-4 shadow-sm">
      <div className="position-relative" style={{width: "60px", height: "60px"}}>
        <div className="spinner-grow text-primary position-absolute" style={{width: "30px", height: "30px", left: "15px", top: "15px", opacity: "0.7", animationDuration: "1s"}} role="status"></div>
        <div className="spinner-border text-secondary position-absolute" style={{width: "60px", height: "60px", left: "0", top: "0", opacity: "0.5", animationDuration: "1.5s"}} role="status"></div>
      </div>
      <p className="text-muted mt-3 fw-light">Loading contamination data...</p>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-danger border-0 shadow-sm rounded-4 d-flex align-items-center" role="alert">
      <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
      <div>{error}</div>
      <button onClick={() => window.location.reload()} className="btn btn-sm btn-outline-danger ms-auto rounded-pill px-3">
        <i className="bi bi-arrow-clockwise me-1"></i>Retry
      </button>
    </div>
  );
  
  if (!chartData) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 12
          }
        },
        onHover: (event, legendItem) => {
          document.getElementById('contamination-canvas').style.cursor = 'pointer';
        },
        onLeave: () => {
          document.getElementById('contamination-canvas').style.cursor = 'default';
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        boxPadding: 5
      },
      title: {
        display: true,
        text: 'Contamination by Reason',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 15
        }
      },
    },
    hover: {
      onHover: (event, elements) => {
        if (elements.length) {
          setActiveIndex(elements[0].index);
        } else {
          setActiveIndex(null);
        }
      }
    },
    cutout: '65%',
  };

  const enhancedOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      legend: {
        ...options.plugins.legend,
        position: 'bottom',
        align: 'start',
        labels: {
          ...options.plugins.legend.labels,
          boxWidth: 15,
          boxHeight: 15,
          padding: 18,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    cutout: '70%',
    elements: {
      arc: {
        borderWidth: 3
      }
    }
  };

  const animationKey = `contamination-chart-${Math.random()}`;

  return (
    <div 
      id="contamination-chart-container"
      className={`card chart-card shadow border-0 rounded-4 overflow-hidden ${isFullscreen ? 'fullscreen-chart' : ''}`}
      style={{transition: "all 0.3s ease"}}
    >
      <div className="card-header bg-gradient border-0 d-flex justify-content-between align-items-center py-3 px-4" 
           style={{background: "linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%)"}}>
        <div>
          <h5 className="mb-0 fw-bold text-primary">
            <i className="bi bi-pie-chart-fill me-2"></i>
            Contamination Analysis
          </h5>
          <p className="text-muted small mb-0 mt-1">Distribution of contamination factors</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="btn-group me-2" role="group" aria-label="Time range">
            <button 
              type="button" 
              className={`btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setTimeRange('week')}
            >Week</button>
            <button 
              type="button" 
              className={`btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setTimeRange('month')}
            >Month</button>
            <button 
              type="button" 
              className={`btn btn-sm ${timeRange === 'year' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setTimeRange('year')}
            >Year</button>
          </div>
          <button 
            className="btn btn-sm btn-light rounded-circle p-2 shadow-sm" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          >
            <i className={`bi bi-${isFullscreen ? 'fullscreen-exit' : 'fullscreen'}`}></i>
          </button>
        </div>
      </div>
      <div className="card-body p-4">
        <div className="chart-container position-relative animation-fade-in" style={{height: "350px"}}>
          <Doughnut 
            data={chartData} 
            options={enhancedOptions} 
            key={animationKey}
            id="contamination-canvas"
          />
          {chartData && (
            <div 
              className="position-absolute top-50 start-50 translate-middle text-center"
              style={{ 
                pointerEvents: 'none',
                transition: "all 0.3s ease",
                transform: "translate(-50%, -50%) scale(1.05)"
              }}
            >
              <div className="bg-transparent  p-4" style={{width: "140px", height: "140px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <h3 className="mb-0 fw-bold" style={{fontSize: "2rem", color: activeIndex !== null ? chartData.datasets[0].backgroundColor[activeIndex] : "#333"}}>
                  {activeIndex !== null ? chartData.datasets[0].data[activeIndex] : 
                    chartData.datasets[0].data.reduce((a, b) => a + b, 0)}
                </h3>
                <div className="text-muted small mt-1">
                  {activeIndex !== null ? chartData.labels[activeIndex] : 'Total Issues'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="card-footer bg-light py-3 px-4 d-flex justify-content-between align-items-center border-0">
        <div className="small text-muted d-flex align-items-center">
          <span className="badge bg-light text-dark rounded-pill border me-2">
            <i className="bi bi-info-circle me-1 text-primary"></i>
            {chartData.labels.length} factors
          </span>
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <div>
          <button className="btn btn-sm btn-outline-primary rounded-pill me-2">
            <i className="bi bi-download me-1"></i>
            Export
          </button>
          <button className="btn btn-sm btn-primary rounded-pill">
            <i className="bi bi-arrow-repeat me-1"></i>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContaminationChart;
