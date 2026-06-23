import { Copy } from 'lucide-react'

interface SectionCopyGutterProps {
  topLevelKeyLines: Map<number, string>
  lineCount: number
  parsed: Record<string, unknown>
  indent: string
  onCopy: (text: string) => void
}

export function SectionCopyGutter({
  topLevelKeyLines,
  lineCount,
  parsed,
  indent,
  onCopy,
}: SectionCopyGutterProps) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: lineCount }, (_, i) => {
        const key = topLevelKeyLines.get(i)
        return (
          <div key={i} className="flex h-5 w-5 items-center justify-center">
            {key !== undefined && (
              <button
                type="button"
                title={key}
                onClick={() => onCopy(JSON.stringify(parsed[key], null, indent))}
                className="text-[#484f58] hover:text-[#7c6ff7]"
              >
                <Copy size={12} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
