import { CopyButton } from '@/components/CopyButton'
import { SectionCopyGutter } from './SectionCopyGutter'
import { getTopLevelKeyLines } from '../jsonUtils'

interface OutputPanelProps {
  output: string
  parsed: unknown
  wrap: boolean
  indent: string
  onCopySection: (text: string) => void
  emptyMessage?: string
}

export function OutputPanel({
  output,
  parsed,
  wrap,
  indent,
  onCopySection,
  emptyMessage = 'formatted output appears here',
}: OutputPanelProps) {
  const lines = output.length > 0 ? output.split('\n') : []
  const topLevelKeyLines =
    parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
      ? getTopLevelKeyLines(lines)
      : new Map<number, string>()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b-[0.5px] border-[#30363d] px-3 py-2">
        <span className="text-[14px] text-[#8b949e]">output</span>
        <CopyButton text={output} size="sm" />
      </div>
      <div className={`min-h-0 flex-1 overflow-auto ${wrap ? '' : 'overflow-x-auto'}`}>
        {lines.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-[15px] text-[#484f58]">
            {emptyMessage}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
