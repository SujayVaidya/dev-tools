import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { LIMITS } from '@/lib/limits'
import { ERRORS } from '@/lib/errors'
import { LimitBanner } from './LimitBanner'

interface DropZoneProps {
  onFile: (text: string, filename: string) => void
  accept?: string
}

export function DropZone({ onFile, accept }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const readFile = (file: File) => {
    if (file.size > LIMITS.FILE_BYTES) {
      setError(ERRORS.FILE_TOO_LARGE((file.size / (1024 * 1024)).toFixed(1)))
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      onFile(String(reader.result ?? ''), file.name)
      toast.success(`Uploaded ${file.name}`)
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) readFile(file)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed bg-[#161b22] py-10 text-[15px] text-[#8b949e] transition-colors duration-150 ${
          isDragging ? 'border-[#7c6ff7]' : 'border-[#30363d]'
        }`}
      >
        Drag and drop a file here, or click to browse
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) readFile(file)
          }}
        />
      </div>
      {error && <div className="mt-2"><LimitBanner message={error} onDismiss={() => setError(null)} /></div>}
    </div>
  )
}
