import { useEditorStorage } from '@/hooks/useEditorStorage'

export function useDiffStorage() {
  const left = useEditorStorage('diff:left')
  const right = useEditorStorage('diff:right')
  return { left, right }
}
