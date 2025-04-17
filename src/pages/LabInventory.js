import React from 'react';
import InventoryList from '../components/inventory/InventoryList';
import MaterialRequestForm from '../components/inventory/MaterialRequestForm';

const LabInventory = () => {
  return (
    <div className="container">
      <h1 className="mb-4">Lab Inventory</h1>
      
      <div className="row">
        <div className="col-md-7">
          <InventoryList />
        </div>
        <div className="col-md-5">
          <MaterialRequestForm />
        </div>
      </div>
    </div>
  );
};

export default LabInventory;
