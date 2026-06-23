interface EncodeDecodeToggleProps {
  mode: 'encode' | 'decode'
  onChange: (mode: 'encode' | 'decode') => void
}

export function EncodeDecodeToggle({ mode, onChange }: EncodeDecodeToggleProps) {
  return (
    <div className="flex gap-1">
      {(['encode', 'decode'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-[6px] border-[0.5px] px-3 py-1 text-[15px] capitalize ${
            mode === option
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
