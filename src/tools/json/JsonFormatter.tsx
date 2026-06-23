import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { useJsonStorage } from './useJsonStorage'
import { usePreference } from '@/hooks/usePreference'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { Toolbar } from './components/Toolbar'
import { InputPanel } from './components/InputPanel'
import { OutputPanel } from './components/OutputPanel'
import { getJsonErrorLocation, indentValue, type IndentOption } from './jsonUtils'

export default function JsonFormatter() {
  useDocumentTitle('JSON Formatter — jayTools')
  const { rawInput, setRawInput, setOutputCache } = useJsonStorage()
  const [wrap, setWrap] = usePreference('pref:wrap', false)
  const [indent, setIndent] = usePreference<IndentOption>('pref:indent', '2')
  const [mode, setMode] = useState<'format' | 'minify'>('format')
  const [filename, setFilename] = useState('formatted.json')
  const { copy } = useCopyToClipboard()

  const [debouncedInput, setDebouncedInput] = useState(rawInput)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedInput(rawInput), 300)
    return () => clearTimeout(timer)
  }, [rawInput])

  const { parsed, error } = useMemo(() => {
    if (debouncedInput.trim() === '') return { parsed: null, error: null }
    try {
      return { parsed: JSON.parse(debouncedInput) as unknown, error: null }
    } catch (err) {
      return { parsed: null, error: err as Error }
    }
  }, [debouncedInput])

  const parseError = error ? getJsonErrorLocation(debouncedInput, error) : null

  const formattedOutput = useMemo(() => {
    if (parsed === null) return ''
    return mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indentValue(indent))
  }, [parsed, mode, indent])

  useEffect(() => {
    setOutputCache(formattedOutput)
  }, [formattedOutput, setOutputCache])

  const handleDownload = () => {
    if (!formattedOutput) return
    const blob = new Blob([formattedOutput], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${filename}`)
  }

  const handleClear = () => {
    setRawInput('')
    setFilename('formatted.json')
  }

  const handleFile = (text: string, name: string) => {
    setRawInput(text)
    setFilename(name.endsWith('.json') ? name : `${name}.json`)
  }

  useKeyboardShortcut('ctrl+shift+f', () => setMode('format'))
  useKeyboardShortcut('ctrl+shift+m', () => setMode('minify'))
  useKeyboardShortcut('ctrl+shift+delete', handleClear)

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <Toolbar
        mode={mode}
        onFormat={() => setMode('format')}
        onMinify={() => setMode('minify')}
        indent={indent}
        onIndentChange={setIndent}
        wrap={wrap}
        onWrapToggle={() => setWrap(!wrap)}
        onDownload={handleDownload}
        onClear={handleClear}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[10px] border-[0.5px] border-[#30363d]">
        <div className="min-w-0 flex-1 border-r-[0.5px] border-[#30363d]">
          <InputPanel
            value={rawInput}
            onChange={setRawInput}
            parseError={parseError}
            onFile={handleFile}
          />
        </div>
        <div className="min-w-0 flex-1">
          <OutputPanel
            output={formattedOutput}
            parsed={parsed}
            wrap={wrap}
            indent={indentValue(indent)}
            onCopySection={copy}
            emptyMessage={
              rawInput.trim() === ''
                ? 'paste JSON, upload a file, or fetch a URL to get started'
                : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}
