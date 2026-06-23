import { useEffect, useRef, useState } from 'react'

interface UseCopyToClipboardResult {
  copy: (text: string) => void
  copied: boolean
}

export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 1500)
    })
  }

  return { copy, copied }
}
