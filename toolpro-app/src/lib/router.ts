import { writable, derived } from 'svelte/store'

export const currentPath = writable(window.location.pathname)

export function navigate(path: string) {
  window.history.pushState({}, '', path)
  currentPath.set(path)
  window.scrollTo(0, 0)
}

export function getParams(path: string, pattern: string): Record<string, string> | null {
  const pathParts = path.split('/').filter(Boolean)
  const patternParts = pattern.split('/').filter(Boolean)
  
  if (pathParts.length !== patternParts.length) return null
  
  const params: Record<string, string> = {}
  
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i]
    } else if (patternParts[i] !== pathParts[i]) {
      return null
    }
  }
  
  return params
}

export function matchRoute(path: string, pattern: string): boolean {
  if (pattern === '*') return true
  
  const pathParts = path.split('/').filter(Boolean)
  const patternParts = pattern.split('/').filter(Boolean)
  
  if (patternParts.length !== pathParts.length) return false
  
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) continue
    if (patternParts[i] !== pathParts[i]) return false
  }
  
  return true
}
