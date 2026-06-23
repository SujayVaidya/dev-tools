import { diffLines, diffChars } from 'diff'

export interface DiffSegment {
  text: string
  type: 'added' | 'removed' | 'unchanged'
}

export interface DiffRow {
  type: 'added' | 'removed' | 'changed' | 'unchanged'
  left: DiffSegment[] | null
  right: DiffSegment[] | null
}

export interface DiffSummary {
  added: number
  removed: number
  changed: number
}

function toLines(value: string): string[] {
  return value.endsWith('\n') ? value.slice(0, -1).split('\n') : value.split('\n')
}

export function computeDiff(
  left: string,
  right: string,
  ignoreWhitespace: boolean
): { rows: DiffRow[]; summary: DiffSummary } {
  const parts = diffLines(left, right, { ignoreWhitespace })
  const rows: DiffRow[] = []
  const summary: DiffSummary = { added: 0, removed: 0, changed: 0 }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]

    if (part.removed && parts[i + 1]?.added) {
      const addedPart = parts[i + 1]
      const removedLines = toLines(part.value)
      const addedLines = toLines(addedPart.value)
      const maxLen = Math.max(removedLines.length, addedLines.length)

      for (let j = 0; j < maxLen; j++) {
        const l = removedLines[j]
        const r = addedLines[j]
        if (l !== undefined && r !== undefined) {
          const charDiff = diffChars(l, r)
          const leftSegments: DiffSegment[] = charDiff
            .filter((c) => !c.added)
            .map((c) => ({ text: c.value, type: c.removed ? 'removed' : 'unchanged' }))
          const rightSegments: DiffSegment[] = charDiff
            .filter((c) => !c.removed)
            .map((c) => ({ text: c.value, type: c.added ? 'added' : 'unchanged' }))
          rows.push({ type: 'changed', left: leftSegments, right: rightSegments })
          summary.changed++
        } else if (l !== undefined) {
          rows.push({ type: 'removed', left: [{ text: l, type: 'removed' }], right: null })
          summary.removed++
        } else if (r !== undefined) {
          rows.push({ type: 'added', left: null, right: [{ text: r, type: 'added' }] })
          summary.added++
        }
      }
      i++
      continue
    }

    const lines = toLines(part.value)
    for (const line of lines) {
      if (part.added) {
        rows.push({ type: 'added', left: null, right: [{ text: line, type: 'added' }] })
        summary.added++
      } else if (part.removed) {
        rows.push({ type: 'removed', left: [{ text: line, type: 'removed' }], right: null })
        summary.removed++
      } else {
        rows.push({
          type: 'unchanged',
          left: [{ text: line, type: 'unchanged' }],
          right: [{ text: line, type: 'unchanged' }],
        })
      }
    }
  }

  return { rows, summary }
}
