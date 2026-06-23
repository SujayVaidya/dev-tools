import type { DiffSummary } from '../diffUtils'

interface DiffSummaryBarProps {
  summary: DiffSummary | null
}

export function DiffSummaryBar({ summary }: DiffSummaryBarProps) {
  if (!summary) return null

  return (
    <div className="flex items-center gap-4 border-b-[0.5px] border-[#30363d] px-3 py-1.5 text-[15px]">
      <span className="text-[#3fb950]">{summary.added} added</span>
      <span className="text-[#f85149]">{summary.removed} removed</span>
      <span className="text-[#d29922]">{summary.changed} changed</span>
    </div>
  )
}
