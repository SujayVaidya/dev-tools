import { Check, Copy } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface CopyButtonProps {
  text: string
  label?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ text, label, size = 'md' }: CopyButtonProps) {
  const { copy, copied } = useCopyToClipboard()
  const iconSize = size === 'sm' ? 13 : 15

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      title="Copy"
      className={`flex items-center gap-1.5 bg-transparent text-[15px] ${
        copied ? 'text-[#3fb950]' : 'text-[#484f58] hover:text-[#8b949e]'
      }`}
    >
      {copied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
      {label && <span>{label}</span>}
    </button>
  )
}
