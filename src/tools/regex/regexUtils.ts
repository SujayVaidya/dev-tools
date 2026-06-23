export interface RegexMatchResult {
  matches: RegExpMatchArray[]
  error: string | null
}

export function computeMatches(pattern: string, flags: string, text: string): RegexMatchResult {
  if (pattern === '') {
    return { matches: [], error: null }
  }
  try {
    let execFlags = flags.includes('g') ? flags : `${flags}g`
    execFlags = execFlags.includes('d') ? execFlags : `${execFlags}d`
    const regex = new RegExp(pattern, execFlags)
    const matches = Array.from(text.matchAll(regex))
    return { matches, error: null }
  } catch (err) {
    return { matches: [], error: err instanceof Error ? err.message : 'Invalid regular expression' }
  }
}
