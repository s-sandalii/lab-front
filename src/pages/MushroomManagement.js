import React, { useState } from 'react';
import BatchForm from '../components/mushroom/BatchForm';
import BatchList from '../components/mushroom/BatchList';

const MushroomManagement = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBatchCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container">
      <h1 className="mb-4">Mushroom Management</h1>
      
      <div className="row mb-4">
        <div className="col-md-12">
          <BatchForm onBatchCreated={handleBatchCreated} />
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <BatchList key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default MushroomManagement;
