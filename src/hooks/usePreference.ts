import { useState } from 'react'
import { prefGet, prefSet } from '@/lib/storage'

export function usePreference<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => prefGet(key, defaultValue))

  const update = (next: T) => {
    setValue(next)
    prefSet(key, next)
  }

  return [value, update]
}
