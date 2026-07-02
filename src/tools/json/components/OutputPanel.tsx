import { useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { SectionCopyGutter } from './SectionCopyGutter'
import { getTopLevelKeyLines } from '../jsonUtils'
import { LIMITS } from '@/lib/limits'

interface OutputPanelProps {
  output: string
  parsed: unknown
  wrap: boolean
  indent: string
  isProcessing?: boolean
  onCopySection: (text: string) => void
  emptyMessage?: string
}

export function OutputPanel({
  output,
  parsed,
  wrap,
  indent,
  isProcessing = false,
  onCopySection,
  emptyMessage = 'formatted output appears here',
}: OutputPanelProps) {
  const lines = useMemo(() => (output.length > 0 ? output.split('\n') : []), [output])

  const topLevelKeyLines = useMemo(
    () =>
      parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
        ? getTopLevelKeyLines(lines)
        : new Map<number, string>(),
    [parsed, lines],
  )

  const hasContent = lines.length > 0

  const header = (
    <div className="flex items-center justify-between border-b-[0.5px] border-[#30363d] px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-[#8b949e]">output</span>
        {isProcessing && (
          <span className="text-[13px] text-[#484f58]">processing…</span>
        )}
      </div>
      <CopyButton text={output} size="sm" />
    </div>
  )

  if (isProcessing && !hasContent) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <div className="flex h-full items-center justify-center text-[15px] text-[#484f58]">
          processing…
        </div>
      </div>
    )
  }

  if (!hasContent) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <div className="flex h-full items-center justify-center text-center text-[15px] text-[#484f58]">
          {emptyMessage}
        </div>
      </div>
    )
  }

  const contentOpacity = isProcessing ? 'opacity-40' : 'opacity-100'

  if (lines.length > LIMITS.JSON_LINE_RENDER_THRESHOLD) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <div className={`relative min-h-0 flex-1 transition-opacity duration-150 ${contentOpacity}`}>
          <textarea
            readOnly
            value={output}
            spellCheck={false}
            className={`h-full w-full resize-none bg-[#161b22] p-3 font-mono text-[16px] text-[#e6edf3] outline-none ${wrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}`}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {header}
      <div className={`min-h-0 flex-1 overflow-auto transition-opacity duration-150 ${contentOpacity} ${wrap ? '' : 'overflow-x-auto'}`}>
        <div className="flex font-mono text-[16px]">
          <div className="flex flex-col text-right text-[#484f58]">
            {lines.map((_, i) => (
              <div key={i} className="h-5 w-10 px-2">
                {i + 1}
              </div>
            ))}
          </div>
          <SectionCopyGutter
            topLevelKeyLines={topLevelKeyLines}
            lineCount={lines.length}
            parsed={(parsed ?? {}) as Record<string, unknown>}
            indent={indent}
            onCopy={onCopySection}
          />
          <div className={`flex-1 ${wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}>
            {lines.map((line, i) => (
              <div key={i} className="h-5 text-[#e6edf3]">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
