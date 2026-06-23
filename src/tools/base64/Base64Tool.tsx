import { useEffect, useMemo, useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { EncodeDecodeToggle } from './components/EncodeDecodeToggle'
import { decodeBase64Lenient } from './base64Utils'
import { CopyButton } from '@/components/CopyButton'
import { ByteCounter } from '@/components/ByteCounter'
import { sessGet, sessSet } from '@/lib/storage'
import { LIMITS } from '@/lib/limits'

const BASE64_INPUT_KEY = 'session:base64:input'

export default function Base64Tool() {
  useDocumentTitle('Base64 — jayTools')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState(() => sessGet(BASE64_INPUT_KEY, ''))
  const [jsonView, setJsonView] = useState<'format' | 'minify'>('format')

  useEffect(() => {
    sessSet(BASE64_INPUT_KEY, input)
  }, [input])

  const { output, ignored, error } = useMemo(() => {
    if (!input) return { output: '', ignored: '', error: null }
    try {
      if (mode === 'encode') return { output: btoa(input), ignored: '', error: null }
      const result = decodeBase64Lenient(input)
      return { output: result.text, ignored: result.ignored, error: null }
    } catch {
      return {
        output: '',
        ignored: '',
        error:
          mode === 'decode'
            ? 'Invalid Base64 input — cannot decode.'
            : 'Input contains characters that cannot be Base64-encoded.',
      }
    }
  }, [input, mode])

  const decodedJson = useMemo(() => {
    if (mode !== 'decode' || !output) return null
    try {
      return JSON.parse(output) as unknown
    } catch {
      return null
    }
  }, [mode, output])

  const displayOutput =
    decodedJson !== null
      ? jsonView === 'format'
        ? JSON.stringify(decodedJson, null, 2)
        : JSON.stringify(decodedJson)
      : output

  const byteLength = new TextEncoder().encode(input).length

  const handleClear = () => setInput('')

  useKeyboardShortcut('ctrl+shift+delete', handleClear)

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <EncodeDecodeToggle mode={mode} onChange={setMode} />
        <button
          type="button"
          onClick={handleClear}
          title="Ctrl+Shift+Delete"
          className="rounded-[6px] border-[0.5px] border-[#30363d] bg-transparent px-2.5 py-1 text-[15px] text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]"
        >
          Clear
        </button>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[14px] text-[#8b949e]">input</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-0 flex-1 resize-none rounded-[6px] border-[0.5px] border-[#30363d] bg-[#161b22] p-3 font-mono text-[16px] text-[#e6edf3] outline-none"
          />
          <ByteCounter bytes={byteLength} maxBytes={LIMITS.PASTE_BYTES} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#8b949e]">output</span>
            <div className="flex items-center gap-2">
              {decodedJson !== null && (
                <div className="flex gap-1">
                  {(['format', 'minify'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setJsonView(option)}
                      className={`rounded-[6px] border-[0.5px] px-2.5 py-0.5 text-[14px] capitalize ${
                        jsonView === option
                          ? 'border-[#7c6ff7] bg-[#7c6ff7] text-[#e6edf3]'
                          : 'border-[#30363d] bg-transparent text-[#8b949e]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              <CopyButton text={displayOutput} size="sm" />
            </div>
          </div>
          <textarea
            value={displayOutput}
            readOnly
            className="min-h-0 flex-1 resize-none rounded-[6px] border-[0.5px] border-[#30363d] bg-[#161b22] p-3 font-mono text-[16px] text-[#e6edf3] outline-none"
          />
          {ignored && (
            <span className="text-[14px] text-[#d29922]">
              Ignored invalid character{ignored.length > 1 ? 's' : ''} to decode: "{ignored}"
            </span>
          )}
        </div>
      </div>

      {error && <div className="text-[15px] text-[#f85149]">{error}</div>}
    </div>
  )
}
