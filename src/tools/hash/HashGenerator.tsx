import { useEffect, useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { usePreference } from '@/hooks/usePreference'
import { HashSelector } from './components/HashSelector'
import { CopyButton } from '@/components/CopyButton'
import { hashText, type HashAlgo } from '@/lib/crypto'

export default function HashGenerator() {
  useDocumentTitle('Hash Generator — jayTools')
  const [algo, setAlgo] = usePreference<HashAlgo>('pref:hash:algo', 'SHA-256')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!input) {
        setOutput('')
        return
      }
      hashText(input, algo).then(setOutput)
    }, 300)
    return () => clearTimeout(timer)
  }, [input, algo])

  const handleClear = () => setInput('')

  useKeyboardShortcut('ctrl+shift+delete', handleClear)

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <HashSelector algo={algo} onChange={setAlgo} />
        <button
          type="button"
          onClick={handleClear}
          title="Ctrl+Shift+Delete"
          className="rounded-[6px] border-[0.5px] border-[#30363d] bg-transparent px-2.5 py-1 text-[15px] text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]"
        >
          Clear
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <span className="text-[14px] text-[#8b949e]">input</span>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder="Text to hash…"
          className="min-h-0 flex-1 resize-none rounded-[6px] border-[0.5px] border-[#30363d] bg-[#161b22] p-3 font-mono text-[16px] text-[#e6edf3] outline-none placeholder:text-[#484f58]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#8b949e]">output</span>
          <CopyButton text={output} size="sm" />
        </div>
        <input
          type="text"
          value={output}
          readOnly
          className="rounded-[6px] border-[0.5px] border-[#30363d] bg-[#161b22] px-3 py-1.5 font-mono text-[16px] text-[#e6edf3] outline-none"
        />
        {algo === 'MD5' && (
          <span className="text-[14px] text-[#484f58]">MD5 is not cryptographically secure</span>
        )}
      </div>
    </div>
  )
}
