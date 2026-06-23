import { get, set, del } from 'idb-keyval'
import { LIMITS } from './limits'

function byteSize(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).length
}

export async function idbGet<T>(key: string): Promise<T | undefined> {
  return get<T>(key)
}

export async function idbSet<T>(key: string, value: T): Promise<{ skipped: boolean }> {
  if (byteSize(value) > LIMITS.IDB_SAVE_BYTES) {
    return { skipped: true }
  }
  await set(key, value)
  return { skipped: false }
}

export async function idbDel(key: string): Promise<void> {
  return del(key)
}

export function prefGet<T>(key: string, defaultValue: T): T {
  const raw = localStorage.getItem(key)
  if (raw === null) return defaultValue
  try {
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

export function prefSet<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function sessGet<T>(key: string, defaultValue: T): T {
  const raw = sessionStorage.getItem(key)
  if (raw === null) return defaultValue
  try {
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

export function sessSet<T>(key: string, value: T): void {
  sessionStorage.setItem(key, JSON.stringify(value))
}
