
// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock inventory data
const MOCK_INVENTORY = [
  {
    id: 1,
    materialType: "SEED",
    quantity: 20,
    thresholdLevel: 50
  },
  {
    id: 2,
    materialType: "COTTON",
    quantity: 500,
    thresholdLevel: 100
  },
  {
    id: 3,
    materialType: "NUTRIENT_MIX",
    quantity: 5,
    thresholdLevel: 10
  },
  {
    id: 4,
    materialType: "POLYTHENE_BAG",
    quantity: 200,
    thresholdLevel: 50
  },
  {
    id: 5,
    materialType: "STERILIZER",
    quantity: 15,
    thresholdLevel: 5
  }
];

// Get all inventory items
export const getInventoryItems = async () => {
  await delay(500);
  return { data: MOCK_INVENTORY };
};

// Update inventory item
export const updateInventoryItem = async (id, data) => {
  await delay(600);
  const item = MOCK_INVENTORY.find(i => i.id === parseInt(id));
  
  if (!item) {
    throw new Error('Inventory item not found');
  }
  
  // Update item data
  item.quantity = data.quantity || item.quantity;
  item.thresholdLevel = data.thresholdLevel || item.thresholdLevel;
  
  return { data: item };
};

// Request materials
export const requestMaterials = async (requestData) => {
  await delay(800);
  // Simulate request success
  return { 
    data: { 
      success: true, 
      message: "Material request submitted successfully",
      requestId: Math.floor(Math.random() * 1000) + 1
    } 
  };
};

// Get low stock alerts
export const getLowStockAlerts = async () => {
  await delay(300);
  const lowStock = MOCK_INVENTORY.filter(item => item.quantity <= item.thresholdLevel);
  return { data: lowStock };
};
