import type { HashAlgo } from '@/lib/crypto'

const ALGOS: HashAlgo[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']

interface HashSelectorProps {
  algo: HashAlgo
  onChange: (algo: HashAlgo) => void
}

export function HashSelector({ algo, onChange }: HashSelectorProps) {
  return (
    <div className="flex gap-1">
      {ALGOS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-[6px] border-[0.5px] px-3 py-1 text-[15px] ${
            algo === option
              ? 'border-[#7c6ff7] bg-[#7c6ff7] text-[#e6edf3]'
              : 'border-[#30363d] bg-transparent text-[#8b949e]'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
