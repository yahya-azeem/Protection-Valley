/**
 * Safe storage wrapper that handles tracking prevention and quota errors
 *
 * Some browsers (Safari, Firefox with tracking protection, private browsing)
 * block access to localStorage, which throws DOMException errors.
 * This utility provides safe fallbacks for these scenarios.
 */

const browser = typeof window !== 'undefined'

// Test if localStorage is accessible
function isStorageAccessible(): boolean {
  if (!browser) return false

  try {
    // Use a simpler check that doesn't trigger tracking prevention warnings
    // Just check if localStorage exists and is not null
    if (!window.localStorage) return false

    // Try to access localStorage.length which is less likely to trigger warnings
    // than setItem in some browsers
    void window.localStorage.length
    return true
  } catch (e) {
    // Storage is blocked by tracking prevention or quota exceeded
    return false
  }
}

// Don't check storage accessibility at module load to avoid console warnings
// Instead, check lazily on first access
let storageAccessible: boolean | null = null

function checkStorageAccess(): boolean {
  if (storageAccessible === null) {
    storageAccessible = isStorageAccessible()
  }
  return storageAccessible
}

/**
 * Safely get an item from localStorage
 * @param key - Storage key
 * @returns The stored value or null if not accessible/not found
 */
export function safeGetItem(key: string): string | null {
  if (!checkStorageAccess()) {
    return null
  }

  try {
    return localStorage.getItem(key)
  } catch (e) {
    console.warn(`Storage access blocked for key "${key}":`, e)
    return null
  }
}

/**
 * Safely set an item in localStorage
 * @param key - Storage key
 * @param value - Value to store
 * @returns true if successful, false otherwise
 */
export function safeSetItem(key: string, value: string): boolean {
  if (!checkStorageAccess()) {
    return false
  }

  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    console.warn(`Storage access blocked when setting "${key}":`, e)
    return false
  }
}

/**
 * Safely remove an item from localStorage
 * @param key - Storage key
 * @returns true if successful, false otherwise
 */
export function safeRemoveItem(key: string): boolean {
  if (!checkStorageAccess()) {
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.warn(`Storage access blocked when removing "${key}":`, e)
    return false
  }
}

/**
 * Check if storage is currently accessible
 */
export function isStorageAvailable(): boolean {
  return checkStorageAccess()
}
