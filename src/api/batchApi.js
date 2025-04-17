// Mock data
const MOCK_BATCHES = [
  {
    id: 1,
    type: "OYSTER",
    initialQuantity: 1000,
    successfulCount: 750,
    contaminatedCount: 50,
    startDate: "2025-04-01",
    expectedCompletionDate: "2025-04-15",
    isCompleted: false
  },
  {
    id: 2,
    type: "SHIITAKE",
    initialQuantity: 500,
    successfulCount: 400,
    contaminatedCount: 30,
    startDate: "2025-04-05",
    expectedCompletionDate: "2025-04-26",
    isCompleted: false
  },
  {
    id: 3,
    type: "PORTOBELLO",
    initialQuantity: 800,
    successfulCount: 650,
    contaminatedCount: 100,
    startDate: "2025-03-20",
    expectedCompletionDate: "2025-04-07",
    isCompleted: true
  },
  {
    id: 4,
    type: "LIONS_MANE",
    initialQuantity: 600,
    successfulCount: 300,
    contaminatedCount: 20,
    startDate: "2025-04-10",
    expectedCompletionDate: "2025-04-27",
    isCompleted: false
  }
];

const MOCK_HISTORY = [
  {
    id: 1,
    batchId: 1,
    updateDate: "2025-04-05",
    successfulToday: 200,
    contaminatedToday: 20,
    contamReason: "MOLD"
  },
  {
    id: 2,
    batchId: 1,
    updateDate: "2025-04-06",
    successfulToday: 300,
    contaminatedToday: 15,
    contamReason: "TEMPERATURE"
  },
  {
    id: 3,
    batchId: 1,
    updateDate: "2025-04-07",
    successfulToday: 250,
    contaminatedToday: 15,
    contamReason: "HUMIDITY"
  }
];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all batches
export const getBatches = async (params) => {
  await delay(500);
  let filteredBatches = [...MOCK_BATCHES];
  
  // Apply filtering based on params
  if (params && params.active === true) {
    filteredBatches = filteredBatches.filter(batch => !batch.isCompleted);
  } else if (params && params.active === false) {
    filteredBatches = filteredBatches.filter(batch => batch.isCompleted);
  }
  
  return { data: filteredBatches };
};

// Get batch by ID
export const getBatchById = async (id) => {
  await delay(300);
  const batch = MOCK_BATCHES.find(b => b.id === parseInt(id));
  
  if (!batch) {
    throw new Error('Batch not found');
  }
  
  return { data: batch };
};

// Create new batch
export const createBatch = async (batchData) => {
  await delay(700);
  const newBatch = {
    ...batchData,
    id: MOCK_BATCHES.length + 1,
    successfulCount: 0,
    contaminatedCount: 0,
    startDate: new Date().toISOString().split('T')[0],
    expectedCompletionDate: new Date(Date.now() + batchData.type === 'SHIITAKE' ? 21 : 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isCompleted: false
  };
  
  MOCK_BATCHES.push(newBatch);
  return { data: newBatch };
};

// Update batch daily progress
export const updateBatchProgress = async (id, updateData) => {
  await delay(500);
  const batch = MOCK_BATCHES.find(b => b.id === parseInt(id));
  
  if (!batch) {
    throw new Error('Batch not found');
  }
  
  // Update batch totals
  batch.successfulCount += updateData.successful || 0;
  batch.contaminatedCount += updateData.contaminated || 0;
  
  // Create history entry
  const historyEntry = {
    id: MOCK_HISTORY.length + 1,
    batchId: batch.id,
    updateDate: new Date().toISOString().split('T')[0],
    successfulToday: updateData.successful || 0,
    contaminatedToday: updateData.contaminated || 0,
    contamReason: updateData.reason || null
  };
  
  MOCK_HISTORY.push(historyEntry);
  
  return { data: historyEntry };
};

// Get batch history
export const getBatchHistory = async (id) => {
  await delay(400);
  const history = MOCK_HISTORY.filter(h => h.batchId === parseInt(id));
  return { data: history };
};

// Delete batch
export const deleteBatch = async (id) => {
  await delay(600);
  const batchIndex = MOCK_BATCHES.findIndex(b => b.id === parseInt(id));
  
  if (batchIndex === -1) {
    throw new Error('Batch not found');
  }
  
  // Remove the batch from the array
  MOCK_BATCHES.splice(batchIndex, 1);
  
  // Also remove any history entries for this batch
  const filteredHistory = MOCK_HISTORY.filter(h => h.batchId !== parseInt(id));
  MOCK_HISTORY.length = 0;
  MOCK_HISTORY.push(...filteredHistory);
  
  return { data: { success: true, message: 'Batch deleted successfully' } };
};

// Get batch statistics for dashboard
export const getBatchesStats = async () => {
  await delay(400);
  
  const total = MOCK_BATCHES.length;
  const active = MOCK_BATCHES.filter(b => !b.isCompleted).length;
  const completed = MOCK_BATCHES.filter(b => b.isCompleted).length;
  
  // Calculate success rate across all batches
  const totalInitialUnits = MOCK_BATCHES.reduce((sum, batch) => sum + batch.initialQuantity, 0);
  const totalSuccessfulUnits = MOCK_BATCHES.reduce((sum, batch) => sum + batch.successfulCount, 0);
  
  const successRate = totalInitialUnits > 0 
    ? Math.round((totalSuccessfulUnits / totalInitialUnits) * 100) 
    : 0;
  
  return {
    data: {
      total,
      active,
      completed,
      successRate
    }
  };
};
