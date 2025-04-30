/**
 * smh-library-storage.js
 * 
 * Provides robust, secure wrappers for localStorage using JSON.
 * Includes exception handling and fallback defaults for resilience.
 * Suitable for use in academic and production environments.
 */

/**
 * Retrieves a JSON-parsed value from localStorage.
 *
 * @param {string} key - The name of the localStorage key to access.
 * @param {*} fallback - A fallback value to return if retrieval or parsing fails.
 * @returns {*} Parsed JSON value or fallback default.
 */
export function smhLibraryStorageGet(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`⚠️ LocalStorage retrieval failed for key: '${key}'`, error);
    return fallback;
  }
}

/**
 * Safely serialises and stores a JSON-compatible object in localStorage.
 *
 * @param {string} key - The name of the localStorage key to write to.
 * @param {*} value - The value to store (must be serialisable to JSON).
 */
export function smhLibraryStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`❌ LocalStorage save error for key: '${key}'`, error);
  }
}
