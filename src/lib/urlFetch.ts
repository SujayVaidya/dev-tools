import { LIMITS } from './limits'
import { ERRORS } from './errors'

export async function fetchUrl(url: string): Promise<{ text: string } | { error: string }> {
  if (!url.startsWith('https://')) {
    return { error: ERRORS.URL_INVALID }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const response = await fetch(url, { signal: controller.signal })

    if (!response.body) {
      const text = await response.text()
      if (new TextEncoder().encode(text).length > LIMITS.URL_BYTES) {
        return { error: ERRORS.URL_TOO_LARGE }
      }
      return { text }
    }

    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let received = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        received += value.length
        if (received > LIMITS.URL_BYTES) {
          controller.abort()
          return { error: ERRORS.URL_TOO_LARGE }
        }
        chunks.push(value)
      }
    }

    const buffer = new Uint8Array(received)
    let offset = 0
    for (const chunk of chunks) {
      buffer.set(chunk, offset)
      offset += chunk.length
    }

    return { text: new TextDecoder().decode(buffer) }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { error: 'Request timed out after 10 seconds.' }
    }
    return { error: ERRORS.URL_CORS }
  } finally {
    clearTimeout(timeout)
  }
}
