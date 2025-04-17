import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h3 className="mb-0">{value}</h3>
        </div>
        <div style={{ color: color, fontSize: '24px' }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
