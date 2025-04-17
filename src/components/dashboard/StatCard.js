import React, { useState, useEffect } from 'react';

const StatCard = ({ title, value, icon, color, trend = "+12%", timeframe = "vs last month" }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const isPositiveTrend = trend.startsWith('+');
  const trendColor = isPositiveTrend ? '#10b981' : '#ef4444';
  
  return (
    <div className="stat-card p-4 h-100 " style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="position-absolute top-0 end-0 p-3 opacity-10" style={{ transform: 'translateX(30%) translateY(-30%)' }}>
        <div style={{ color, fontSize: '100px', opacity: '0.1' }}>
          {icon}
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted mb-2" style={{ fontSize: '0.9rem', fontWeight: '500' }}>{title}</h6>
          <h3 className="mb-0" style={{ fontWeight: '700', color: '#1e293b' }}>{value}</h3>
          
          <div className="d-flex align-items-center mt-2">
            <span style={{ 
              color: trendColor, 
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {trend} <i className={`bi bi-arrow-${isPositiveTrend ? 'up' : 'down'}`}></i>
            </span>
            <span className="ms-2 text-muted" style={{ fontSize: '0.75rem' }}>
              {timeframe}
            </span>
          </div>
        </div>
        
        <div 
          className="icon-container" 
          style={{ 
            color: color,
            fontSize: '28px',
            backgroundColor: `${color}15`,
            height: '65px',
            width: '65px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: `0 5px 15px ${color}25`,
            transform: 'rotate(0deg) scale(1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(5deg) scale(1.1)';
            e.currentTarget.style.boxShadow = `0 8px 20px ${color}35`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            e.currentTarget.style.boxShadow = `0 5px 15px ${color}25`;
          }}
        >
          {icon}
        </div>
      </div>
      
      <div className="mt-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small className="text-muted">Progress</small>
          <small style={{ color, fontWeight: '600' }}>70%</small>
        </div>
        <div className="progress" style={{ 
          height: '6px', 
          backgroundColor: '#f1f5f9',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ 
              width: animate ? '70%' : '0%', 
              backgroundColor: color,
              transition: 'width 1.5s cubic-bezier(0.12, 0.45, 0.21, 1)',
              borderRadius: '6px',
              boxShadow: `0 0 10px ${color}60`
            }} 
            aria-valuenow="70" 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
      </div>
      
      <div className="mt-3 pt-2 d-flex justify-content-between align-items-center border-top border-light">
        <div className="mini-chart">
          <svg width="80" height="24" viewBox="0 0 80 24">
            <defs>
              <linearGradient id={`sparkline-gradient-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {(() => {
              const points = [];
              const baseValue = isPositiveTrend ? 15 : 8;
              const pointCount = 8;
              
              for (let i = 0; i < pointCount; i++) {
                const x = (i / (pointCount - 1)) * 80;
                const randomVariation = Math.random() * 5;
                const trend = isPositiveTrend 
                  ? Math.sin((i / (pointCount - 1)) * Math.PI) * 8
                  : -Math.sin((i / (pointCount - 1)) * Math.PI) * 8;
                const y = 24 - (baseValue + trend + randomVariation);
                points.push(`${x},${y}`);
              }
              
              const pointsStr = points.join(' ');
              const areaPath = `${pointsStr} 80,24 0,24`;
              
              return (
                <>
                  <path 
                    d={`M${areaPath}Z`} 
                    fill={`url(#sparkline-gradient-${title.replace(/\s+/g, '')})`} 
                  />
                  <polyline
                    points={pointsStr}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {points.map((point, i) => {
                    const [x, y] = point.split(',').map(Number);
                    if (i === 0 || i === points.length - 1) {
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="2"
                          fill="#fff"
                          stroke={color}
                          strokeWidth="1"
                        />
                      );
                    }
                    return null;
                  })}
                </>
              );
            })()}
          </svg>
        </div>
        
        <button 
          className="btn btn-sm rounded-pill view-details-btn"
          style={{ 
            background: `linear-gradient(135deg, ${color}10, ${color}25)`,
            border: `1px solid ${color}30`,
            color: color,
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '0.25rem 0.75rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(3px)';
            e.currentTarget.style.boxShadow = `0 3px 8px ${color}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          View Details <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
      
      <div className="position-absolute bottom-0 start-0 p-3">
        <div className="badge rounded-pill bg-white text-dark shadow-sm" 
          style={{ 
            fontSize: '0.7rem', 
            border: '1px solid rgba(0,0,0,0.05)',
            opacity: 0.7
          }}
        >
          <i className="bi bi-clock me-1" style={{ fontSize: '0.65rem' }}></i>
          Updated now
        </div>
      </div>
    </div>
  );
};

export default StatCard;
