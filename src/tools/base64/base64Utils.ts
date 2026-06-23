export interface LenientDecodeResult {
  text: string
  ignored: string
}

export function decodeBase64Lenient(input: string): LenientDecodeResult {
  let s = input.trim().replace(/\s/g, '')

  if (s.includes('%')) {
    try {
      s = decodeURIComponent(s)
    } catch {
      // not percent-encoded after all — keep original
    }
  }

  s = s.replace(/-/g, '+').replace(/_/g, '/')

  try {
    return { text: atob(s), ignored: '' }
  } catch {
    // strip stray characters outside the base64 alphabet (e.g. trailing junk) and retry
    const invalidChars = s.match(/[^A-Za-z0-9+/=]/g) ?? []
    const stripped = s.replace(/[^A-Za-z0-9+/=]/g, '')
    const padded = stripped + '='.repeat((4 - (stripped.length % 4)) % 4)
    return { text: atob(padded), ignored: invalidChars.join('') }
  }
}
