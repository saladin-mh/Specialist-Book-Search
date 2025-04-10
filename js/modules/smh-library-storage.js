// SMH Library: LocalStorage Utility Functions

// Read from storage safely
export function smhLibraryStorageGet(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.warn(`SMH Library: Failed to read "${key}"`, err);
    return defaultValue;
  }
}

// Write to storage
export function smhLibraryStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`SMH Library: Failed to save "${key}"`, err);
  }
}

// Remove item from storage
export function smhLibraryStorageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`SMH Library: Failed to remove "${key}"`, err);
  }
}