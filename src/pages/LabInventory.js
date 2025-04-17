import React from 'react';
import InventoryList from '../components/inventory/InventoryList';
import MaterialRequestForm from '../components/inventory/MaterialRequestForm';
import StockAlert from '../components/inventory/StockAlert';
import { FaWarehouse, FaChartLine } from 'react-icons/fa';

const LabInventory = () => {
  return (
    <div className="container py-4">
      <div className="header-section p-4 mb-4 bg-light rounded-3 shadow-sm border-start border-4 border-success">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 p-3 me-3">
              <FaWarehouse className="text-success" style={{ fontSize: '1.8rem' }} />
            </div>
            <div>
              <h1 className="mb-1 fw-bold">Lab Inventory Management</h1>
              <p className="text-muted mb-0">Manage your laboratory resources and stock levels</p>
            </div>
          </div>
          <button className="btn btn-success d-none d-md-flex align-items-center">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Item
          </button>
        </div>
      </div>
      
      <StockAlert />
      
      <div className="row g-4">
        <div className="col-lg-8 order-2 order-lg-1">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
            <div className="card-header bg-white p-3 border-bottom border-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-success">Inventory Items</h5>
                <div className="input-group w-auto">
                  <input type="text" className="form-control" placeholder="Search inventory..." />
                  <button className="btn btn-outline-success" type="button">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <InventoryList />
            </div>
          </div>
        </div>
        <div className="col-lg-4 order-1 order-lg-2">
          <div className="card border-0 rounded-3 mb-4">

            <div className="card-body">
              <MaterialRequestForm />
            </div>
          </div>
          
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-success bg-opacity-10 border-0">
              <div className="d-flex align-items-center">
                <FaChartLine className="me-2 text-success" />
                <h5 className="mb-0 fw-bold text-success">Inventory Stats</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 rounded-3 stat-card bg-primary bg-opacity-10 text-center h-100">
                    <div className="stat-icon mb-2">
                      <i className="bi bi-box-seam fs-4 text-primary"></i>
                    </div>
                    <h2 className="mb-1 fw-bold text-primary">24</h2>
                    <p className="small mb-0">Total Items</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 stat-card bg-danger bg-opacity-10 text-center h-100">
                    <div className="stat-icon mb-2">
                      <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
                    </div>
                    <h2 className="mb-1 fw-bold text-danger">5</h2>
                    <p className="small mb-0">Low Stock</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 stat-card bg-success bg-opacity-10 text-center h-100">
                    <div className="stat-icon mb-2">
                      <i className="bi bi-check-circle fs-4 text-success"></i>
                    </div>
                    <h2 className="mb-1 fw-bold text-success">12</h2>
                    <p className="small mb-0">Requests</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 stat-card bg-warning bg-opacity-10 text-center h-100">
                    <div className="stat-icon mb-2">
                      <i className="bi bi-hourglass-split fs-4 text-warning"></i>
                    </div>
                    <h2 className="mb-1 fw-bold text-warning">8</h2>
                    <p className="small mb-0">Pending</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer bg-light text-center py-2 border-0">
              <button
                type="button"
                className="btn btn-link text-success text-decoration-none p-0"
                style={{ fontWeight: 500 }}
              >
                View detailed statistics
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .stat-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .icon-wrapper {
          width: 60px;
          height: 60px;
        }
      `}</style>
    </div>
  );
};

export default LabInventory;
