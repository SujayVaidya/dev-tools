export type HashAlgo = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Pure-JS MD5 (RFC 1321) — no external dependency.
function md5(input: string): string {
  const rotl = (x: number, c: number) => (x << c) | (x >>> (32 - c))

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
    14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15,
    21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ]

  const k = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613,
    0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193,
    0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d,
    0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
    0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
    0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244,
    0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb,
    0xeb86d391,
  ]

  const bytes = new TextEncoder().encode(input)
  const bitLen = bytes.length * 8

  const withPad = new Uint8Array(((bytes.length + 8) >> 6 << 6) + 64)
  withPad.set(bytes)
  withPad[bytes.length] = 0x80

  const view = new DataView(withPad.buffer)
  view.setUint32(withPad.length - 8, bitLen >>> 0, true)
  view.setUint32(withPad.length - 4, Math.floor(bitLen / 0x100000000), true)

  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476

  for (let chunkStart = 0; chunkStart < withPad.length; chunkStart += 64) {
    const m = new Array<number>(16)
    for (let i = 0; i < 16; i++) {
      m[i] = view.getUint32(chunkStart + i * 4, true)
    }

    let a = a0
    let b = b0
    let c = c0
    let d = d0

    for (let i = 0; i < 64; i++) {
      let f: number
      let g: number
      if (i < 16) {
        f = (b & c) | (~b & d)
        g = i
      } else if (i < 32) {
        f = (d & b) | (~d & c)
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        f = b ^ c ^ d
        g = (3 * i + 5) % 16
      } else {
        f = c ^ (b | ~d)
        g = (7 * i) % 16
      }

      f = (f + a + k[i] + m[g]) | 0
      a = d
      d = c
      c = b
      b = (b + rotl(f, s[i])) | 0
    }

    a0 = (a0 + a) | 0
    b0 = (b0 + b) | 0
    c0 = (c0 + c) | 0
    d0 = (d0 + d) | 0
  }

  const out = new Uint8Array(16)
  const outView = new DataView(out.buffer)
  outView.setUint32(0, a0 >>> 0, true)
  outView.setUint32(4, b0 >>> 0, true)
  outView.setUint32(8, c0 >>> 0, true)
  outView.setUint32(12, d0 >>> 0, true)

  return toHex(out)
}

export async function hashText(text: string, algo: HashAlgo): Promise<string> {
  if (algo === 'MD5') {
    return md5(text)
  }
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest(algo, data)
  return toHex(new Uint8Array(digest))
}

export function generateUUIDv4(): string {
  return crypto.randomUUID()
}

export function generateUUIDv7(): string {
  const timestamp = BigInt(Date.now())
  const randomBytes = crypto.getRandomValues(new Uint8Array(10))

  const bytes = new Uint8Array(16)
  bytes[0] = Number((timestamp >> 40n) & 0xffn)
  bytes[1] = Number((timestamp >> 32n) & 0xffn)
  bytes[2] = Number((timestamp >> 24n) & 0xffn)
  bytes[3] = Number((timestamp >> 16n) & 0xffn)
  bytes[4] = Number((timestamp >> 8n) & 0xffn)
  bytes[5] = Number(timestamp & 0xffn)

  bytes.set(randomBytes, 6)

  bytes[6] = (bytes[6] & 0x0f) | 0x70 // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // variant

  const hex = toHex(bytes)
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join(
    '-'
  )
}

export function generateRandomId(length: number): string {
  const byteLength = Math.ceil(length / 2)
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength))
  return toHex(bytes).slice(0, length)
}

function withHyphens(hex: string): string {
  if (hex.length === 32) {
    return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join(
      '-'
    )
  }
  const groups = [8, 4, 4, 4]
  let result = ''
  let idx = 0
  for (const size of groups) {
    if (idx >= hex.length) break
    result += hex.slice(idx, idx + size)
    idx += size
    if (idx < hex.length) result += '-'
  }
  return result + hex.slice(idx)
}

export interface GenerateIdsOptions {
  length: number
  version: 'v4' | 'v7'
  hyphens: boolean
  uppercase: boolean
  count: number
}

export function generateIds(options: GenerateIdsOptions): string[] {
  const { length, version, hyphens, uppercase, count } = options

  return Array.from({ length: count }, () => {
    const raw =
      length === 32
        ? (version === 'v7' ? generateUUIDv7() : generateUUIDv4()).replace(/-/g, '')
        : generateRandomId(length)

    const withFormat = hyphens && length >= 8 ? withHyphens(raw) : raw
    return uppercase ? withFormat.toUpperCase() : withFormat.toLowerCase()
  })
}
