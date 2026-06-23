import { useEditorStorage } from '@/hooks/useEditorStorage'

export function useJsonStorage() {
  const { value: rawInput, setValue: setRawInput, isSaving, savePaused } = useEditorStorage(
    'json:input'
  )
  const { setValue: setOutputCache } = useEditorStorage('json:output')

  return { rawInput, setRawInput, setOutputCache, isSaving, savePaused }
}
