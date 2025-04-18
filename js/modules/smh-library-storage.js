/**
 * smh-library-storage.js
 * Provides simple and safe wrappers for interacting with localStorage using JSON.
 * Ensures fallback defaults and guards against malformed data or quota errors.
 */

/**
 * Retrieves a parsed value from localStorage.
 *
 * @param {string} key - The localStorage key to retrieve.
 * @param {*} fallback - A fallback value to return if the key is not found or parsing fails.
 * @returns {*} - The parsed value from localStorage or the fallback.
 */
export function smhLibraryStorageGet(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.warn(`LocalStorage retrieval error for key: '${key}'`, e);
    return fallback;
  }
}

/**
 * Stores a JSON-serializable value to localStorage.
 *
 * @param {string} key - The localStorage key to store under.
 * @param {*} value - The value to store (must be JSON-serializable).
 */
export function smhLibraryStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`LocalStorage save error for key: '${key}'`, e);
  }
}

