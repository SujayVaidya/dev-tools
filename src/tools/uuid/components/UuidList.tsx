import { toast } from 'sonner'
import { Copy } from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'

interface UuidListProps {
  ids: string[]
}

export function UuidList({ ids }: UuidListProps) {
  const copyAll = () => {
    navigator.clipboard.writeText(ids.join('\n')).then(() => toast.success('Copied all to clipboard'))
  }

  return (
    <div className="rounded-[10px] border-[0.5px] border-[#30363d] bg-[#161b22]">
      <div className="flex items-center justify-between border-b-[0.5px] border-[#30363d] px-3 py-2">
        <span className="text-[14px] text-[#8b949e]">{ids.length} generated</span>
        <button
          type="button"
          onClick={copyAll}
          className="flex items-center gap-1.5 text-[15px] text-[#484f58] hover:text-[#8b949e]"
        >
          <Copy size={13} />
          Copy all
        </button>
      </div>
      <div>
        {ids.map((id, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 border-b-[0.5px] border-[#21262d] px-3 py-1.5 last:border-b-0 hover:bg-[#1c2128]"
          >
            <span className="w-8 text-[14px] text-[#484f58]">{i + 1}</span>
            <span className="flex-1 font-mono text-[16px] text-[#e6edf3]">{id}</span>
            <CopyButton text={id} size="sm" />
          </div>
        ))}
      </div>
    </div>
  )
}
