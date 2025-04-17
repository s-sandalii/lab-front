
console.log("✅ dashboardApi.js loaded");

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock dashboard statistics
const MOCK_DASHBOARD_STATS = {
  activeBatchCount: 3,
  overallSuccessRate: 85.5,
  lowStockItems: [
    { id: 1, materialType: "SEED", quantity: 20, thresholdLevel: 50 },
    { id: 3, materialType: "NUTRIENT_MIX", quantity: 5, thresholdLevel: 10 }
  ],
  productionReadyCount: 1200
};

// Mock growth status data (daily)
const MOCK_DAILY_GROWTH = {
  labels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 6", "Apr 7"],
  successful: [50, 120, 180, 220, 300, 280, 250],
  contaminated: [5, 10, 15, 20, 15, 10, 5]
};

// Mock growth status data (monthly)
const MOCK_MONTHLY_GROWTH = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  successful: [1200, 1500, 1800, 2000, 0, 0],
  contaminated: [200, 180, 150, 100, 0, 0]
};

// Mock contamination data
const MOCK_CONTAMINATION = {
  labels: ["Mold", "Bacteria", "Temperature", "Humidity", "Other"],
  values: [45, 20, 15, 12, 8]
};

// Get dashboard statistics
export const getDashboardStats = async () => {
    console.log("Fetching dashboard stats...");
    await delay(500);  // Simulate network delay
    return { data: MOCK_DASHBOARD_STATS };  // Return mock stats
  };
  

// Get growth status data
export const getGrowthStatusData = async (period = 'monthly') => {
  await delay(600);
  return { 
    data: period === 'monthly' ? MOCK_MONTHLY_GROWTH : MOCK_DAILY_GROWTH 
  };
};

// Get contamination data
export const getContaminationData = async () => {
  await delay(400);
  return { data: MOCK_CONTAMINATION };
};
