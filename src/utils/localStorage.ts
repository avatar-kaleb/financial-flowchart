// Local storage keys
const FLOWCHART_HISTORY_KEY = 'finance-flowchart-history';
const FLOWCHART_CURRENT_NODE_KEY = 'finance-flowchart-current-node';

/**
 * Save flowchart history to local storage
 */
export const saveHistoryToLocalStorage = (history: string[]): void => {
  try {
    localStorage.setItem(FLOWCHART_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history to local storage:', error);
  }
};

/**
 * Load flowchart history from local storage
 */
export const loadHistoryFromLocalStorage = (): string[] | null => {
  try {
    const storedHistory = localStorage.getItem(FLOWCHART_HISTORY_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error('Failed to load history from local storage:', error);
  }
  return null;
};

/**
 * Save current node to local storage
 */
export const saveCurrentNodeToLocalStorage = (nodeId: string): void => {
  try {
    localStorage.setItem(FLOWCHART_CURRENT_NODE_KEY, nodeId);
  } catch (error) {
    console.error('Failed to save current node to local storage:', error);
  }
};

/**
 * Load current node from local storage
 */
export const loadCurrentNodeFromLocalStorage = (): string | null => {
  try {
    return localStorage.getItem(FLOWCHART_CURRENT_NODE_KEY);
  } catch (error) {
    console.error('Failed to load current node from local storage:', error);
  }
  return null;
};

/**
 * Clear all flowchart data from local storage
 */
export const clearFlowchartFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(FLOWCHART_HISTORY_KEY);
    localStorage.removeItem(FLOWCHART_CURRENT_NODE_KEY);
  } catch (error) {
    console.error('Failed to clear flowchart data from local storage:', error);
  }
};
