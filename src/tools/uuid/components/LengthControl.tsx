import { LIMITS } from '@/lib/limits'

interface LengthControlProps {
  length: number
  onChange: (length: number) => void
}

export function LengthControl({ length, onChange }: LengthControlProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={LIMITS.UUID_LENGTH_MIN}
        max={LIMITS.UUID_LENGTH_MAX}
        value={length}
        onChange={(e) => {
          const next = Number(e.target.value)
          if (!Number.isNaN(next)) {
            onChange(Math.min(LIMITS.UUID_LENGTH_MAX, Math.max(LIMITS.UUID_LENGTH_MIN, next)))
          }
        }}
        className="w-20 rounded-[6px] border-[0.5px] border-[#30363d] bg-[#161b22] px-2 py-1 text-[16px] text-[#e6edf3] outline-none"
      />
      <span className="text-[14px] text-[#484f58]">chars</span>
      {length !== 32 && <span className="text-[14px] text-[#484f58]">(random ID)</span>}
    </div>
  )
}
