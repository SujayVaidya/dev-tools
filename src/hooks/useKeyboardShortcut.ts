import { useEffect } from 'react'

function matchesCombo(event: KeyboardEvent, combo: string): boolean {
  const parts = combo.toLowerCase().split('+')
  const key = parts[parts.length - 1]
  const needsCtrl = parts.includes('ctrl')
  const needsShift = parts.includes('shift')
  return (
    event.key.toLowerCase() === key && event.ctrlKey === needsCtrl && event.shiftKey === needsShift
  )
}

export function useKeyboardShortcut(combo: string, handler: () => void): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (matchesCombo(event, combo)) {
        event.preventDefault()
        handler()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [combo, handler])
}
