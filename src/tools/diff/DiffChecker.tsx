import { useEffect, useState } from 'react'
import { createPatch } from 'diff'
import { toast } from 'sonner'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { useDiffStorage } from './useDiffStorage'
import { usePreference } from '@/hooks/usePreference'
import { DiffPane } from './components/DiffPane'
import { DiffSummaryBar } from './components/DiffSummaryBar'
import { computeDiff, type DiffRow, type DiffSummary } from './diffUtils'

export default function DiffChecker() {
  useDocumentTitle('Diff Checker — jayTools')
  const { left, right } = useDiffStorage()
  const [wrap, setWrap] = usePreference('pref:diff:wrap', false)
  const [ignoreWhitespace, setIgnoreWhitespace] = usePreference('pref:diff:ignoreWhitespace', false)
  const [rows, setRows] = useState<DiffRow[] | null>(null)
  const [summary, setSummary] = useState<DiffSummary | null>(null)

  const runCompare = () => {
    const { rows: nextRows, summary: nextSummary } = computeDiff(
      left.value,
      right.value,
      ignoreWhitespace
    )
    setRows(nextRows)
    setSummary(nextSummary)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (rows !== null) runCompare()
    }, 800)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left.value, right.value, ignoreWhitespace])

  const handleClear = () => {
    left.setValue('')
    right.setValue('')
    setRows(null)
    setSummary(null)
  }

  const handleDownloadPatch = () => {
    const patch = createPatch('diff.txt', left.value, right.value)
    const blob = new Blob([patch], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diff.patch'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded diff.patch')
  }

  useKeyboardShortcut('ctrl+shift+c', runCompare)
  useKeyboardShortcut('ctrl+shift+delete', handleClear)

  const showEmptyHint = rows === null && left.value === '' && right.value === ''

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-2 rounded-[10px] border-[0.5px] border-[#30363d] px-3 py-2">
        <button
          type="button"
          onClick={runCompare}
          title="Ctrl+Shift+C"
          className="rounded-[6px] border-[0.5px] border-[#30363d] bg-transparent px-2.5 py-1 text-[15px] text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]"
        >
          Compare
        </button>
        <button
          type="button"
          onClick={() => setWrap(!wrap)}
          className={`rounded-[6px] border-[0.5px] px-2.5 py-1 text-[15px] ${
            wrap ? 'border-[#7c6ff7] text-[#7c6ff7]' : 'border-[#30363d] text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]'
          }`}
        >
          Wrap
        </button>
        <button
          type="button"
          onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
          className={`rounded-[6px] border-[0.5px] px-2.5 py-1 text-[15px] ${
            ignoreWhitespace
              ? 'border-[#7c6ff7] text-[#7c6ff7]'
              : 'border-[#30363d] text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]'
          }`}
        >
          Ignore whitespace
        </button>
        <div className="h-4 w-px bg-[#30363d]" />
        <button
          type="button"
          onClick={handleDownloadPatch}
          className="rounded-[6px] border-[0.5px] border-[#30363d] bg-transparent px-2.5 py-1 text-[15px] text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]"
        >
          Download patch
        </button>
        <button
          type="button"
          onClick={handleClear}
          title="Ctrl+Shift+Delete"
          className="rounded-[6px] border-[0.5px] border-[#30363d] bg-transparent px-2.5 py-1 text-[15px] text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]"
        >
          Clear
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border-[0.5px] border-[#30363d]">
        <DiffSummaryBar summary={summary} />
        {showEmptyHint && (
          <div className="border-b-[0.5px] border-[#30363d] px-3 py-1.5 text-center text-[15px] text-[#484f58]">
            paste text in both panes, then compare
          </div>
        )}
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 border-r-[0.5px] border-[#30363d]">
            <DiffPane
              label="Original"
              value={left.value}
              onChange={left.setValue}
              rows={rows}
              side="left"
              wrap={wrap}
            />
          </div>
          <div className="min-w-0 flex-1">
            <DiffPane
              label="Changed"
              value={right.value}
              onChange={right.setValue}
              rows={rows}
              side="right"
              wrap={wrap}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
