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
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    // Storage is blocked by tracking prevention or quota exceeded
    return false
  }
}

// Check storage accessibility once at module load
const storageAccessible = isStorageAccessible()

/**
 * Safely get an item from localStorage
 * @param key - Storage key
 * @returns The stored value or null if not accessible/not found
 */
export function safeGetItem(key: string): string | null {
  if (!storageAccessible) {
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
  if (!storageAccessible) {
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
  if (!storageAccessible) {
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
  return storageAccessible
}
