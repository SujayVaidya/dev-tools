export type IndentOption = '2' | '4' | 'tab'

export function indentValue(option: IndentOption): string {
  if (option === '2') return '  '
  if (option === '4') return '    '
  return '\t'
}

export function getJsonErrorLocation(
  input: string,
  error: Error
): { line: number; col: number } {
  const lineColMatch = error.message.match(/line (\d+) column (\d+)/)
  if (lineColMatch) {
    return { line: Number(lineColMatch[1]), col: Number(lineColMatch[2]) }
  }

  const positionMatch = error.message.match(/position (\d+)/)
  if (positionMatch) {
    const position = Number(positionMatch[1])
    const upToError = input.slice(0, position)
    const lines = upToError.split('\n')
    return { line: lines.length, col: lines[lines.length - 1].length + 1 }
  }

  return { line: 1, col: 1 }
}

export function extractTopLevelKeys(parsed: unknown): string[] {
  if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return Object.keys(parsed as Record<string, unknown>)
  }
  return []
}

function lineDepthDelta(line: string): number {
  let delta = 0
  let inString = false
  let escape = false
  for (const ch of line) {
    if (escape) {
      escape = false
      continue
    }
    if (ch === '\\' && inString) {
      escape = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (ch === '{' || ch === '[') delta++
    else if (ch === '}' || ch === ']') delta--
  }
  return delta
}

export function getTopLevelKeyLines(lines: string[]): Map<number, string> {
  const map = new Map<number, string>()
  let depth = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const keyMatch = line.match(/^\s*"((?:[^"\\]|\\.)*)":/)
    if (depth === 1 && keyMatch) {
      map.set(i, keyMatch[1])
    }
    depth += lineDepthDelta(line)
  }
  return map
}
