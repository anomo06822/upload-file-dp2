/**
 * LocalStorage Service for managing JSON data
 */

const STORAGE_KEY = 'uploaded_json_data';
const HISTORY_KEY = 'upload_history';

export interface StorageItem {
  id: string;
  data: any;
  timestamp: number;
  name: string;
  size: number;
}

/**
 * Save data to localStorage
 */
export function saveData(data: any, name: string = 'Untitled'): StorageItem {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is not available');
  }

  const item: StorageItem = {
    id: generateId(),
    data,
    timestamp: Date.now(),
    name,
    size: JSON.stringify(data).length,
  };

  try {
    // Save current data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item));

    // Add to history
    addToHistory(item);

    return item;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('存儲空間不足，請清理歷史記錄');
    }
    throw error;
  }
}

/**
 * Load current data from localStorage
 */
export function loadData(): StorageItem | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load data:', error);
    return null;
  }
}

/**
 * Clear current data
 */
export function clearData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get upload history
 */
export function getHistory(): StorageItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Add item to history
 */
function addToHistory(item: StorageItem): void {
  const history = getHistory();

  // Add new item to the beginning
  history.unshift(item);

  // Keep only last 10 items
  const limitedHistory = history.slice(0, 10);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

/**
 * Load specific item from history by ID
 */
export function loadHistoryItem(id: string): StorageItem | null {
  const history = getHistory();
  return history.find(item => item.id === id) || null;
}

/**
 * Delete specific item from history
 */
export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
}

/**
 * Export data as JSON file
 */
export function exportData(data: any, filename: string = 'data.json'): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): {
  used: number;
  percentage: number;
  usedFormatted: string;
} {
  if (typeof window === 'undefined') {
    return { used: 0, percentage: 0, usedFormatted: '0 KB' };
  }

  let used = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // Most browsers allow ~5-10MB for localStorage
  const limit = 5 * 1024 * 1024; // Assume 5MB
  const percentage = (used / limit) * 100;
  const usedFormatted = (used / 1024).toFixed(2) + ' KB';

  return {
    used,
    percentage,
    usedFormatted,
  };
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
