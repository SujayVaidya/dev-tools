import { useEffect, useRef, useState } from 'react'
import { idbGet, idbSet } from '@/lib/storage'

interface UseEditorStorageResult {
  value: string
  setValue: (value: string) => void
  isSaving: boolean
  savePaused: boolean
}

export function useEditorStorage(key: string, defaultValue = ''): UseEditorStorageResult {
  const [value, setValue] = useState(defaultValue)
  const [isSaving, setIsSaving] = useState(false)
  const [savePaused, setSavePaused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    idbGet<string>(key).then((stored) => {
      if (!cancelled && stored !== undefined) {
        setValue(stored)
      }
    })
    return () => {
      cancelled = true
    }
  }, [key])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      setIsSaving(true)
      idbSet(key, value)
        .then(({ skipped }) => {
          setSavePaused(skipped)
        })
        .finally(() => setIsSaving(false))
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [key, value])

  return { value, setValue, isSaving, savePaused }
}
