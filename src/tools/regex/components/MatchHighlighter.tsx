interface MatchWithIndices extends RegExpMatchArray {
  indices?: Array<[number, number] | undefined>
}

interface MatchHighlighterProps {
  text: string
  matches: RegExpMatchArray[]
}

const GROUP_SHADES = ['#7c6ff7', '#9a8ff9', '#b8affa', '#d6cffc']

export function MatchHighlighter({ text, matches }: MatchHighlighterProps) {
  const capped = matches.slice(0, 1000) as MatchWithIndices[]
  const overflow = matches.length - capped.length

  const segments: { text: string; isMatch: boolean; groupColor?: string }[] = []
  let cursor = 0

  for (const match of capped) {
    const start = match.index ?? 0
    const end = start + match[0].length
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), isMatch: false })
    }

    const groupIndices = match.indices?.slice(1).filter((idx): idx is [number, number] => !!idx) ?? []
    if (groupIndices.length === 0) {
      segments.push({ text: text.slice(start, end), isMatch: true })
    } else {
      let groupCursor = start
      groupIndices.forEach(([gStart, gEnd], i) => {
        if (gStart > groupCursor) {
          segments.push({ text: text.slice(groupCursor, gStart), isMatch: true })
        }
        segments.push({
          text: text.slice(gStart, gEnd),
          isMatch: true,
          groupColor: GROUP_SHADES[i % GROUP_SHADES.length],
        })
        groupCursor = gEnd
      })
      if (groupCursor < end) {
        segments.push({ text: text.slice(groupCursor, end), isMatch: true })
      }
    }

    cursor = end
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false })
  }

  return (
    <div className="whitespace-pre-wrap rounded-[6px] border-[0.5px] border-[#30363d] bg-[#161b22] p-3 font-mono text-[16px] text-[#e6edf3]">
      {segments.map((seg, i) =>
        seg.isMatch ? (
          <mark
            key={i}
            style={{ backgroundColor: seg.groupColor ?? '#7c6ff7', color: '#0d0d0f' }}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
      {overflow > 0 && (
        <div className="mt-2 text-[14px] text-[#484f58]">…and {overflow} more matches</div>
      )}
    </div>
  )
}
