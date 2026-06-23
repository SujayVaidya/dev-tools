interface ByteCounterProps {
  bytes: number
  maxBytes: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ByteCounter({ bytes, maxBytes }: ByteCounterProps) {
  const ratio = bytes / maxBytes
  const color = ratio > 0.95 ? '#f85149' : ratio > 0.8 ? '#d29922' : '#484f58'

  return (
    <div className="text-right text-[14px]" style={{ color }}>
      {formatBytes(bytes)} / {formatBytes(maxBytes)}
    </div>
  )
}
