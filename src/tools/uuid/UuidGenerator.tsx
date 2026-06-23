import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { usePreference } from '@/hooks/usePreference'
import { generateIds } from '@/lib/crypto'
import { LIMITS } from '@/lib/limits'
import { LengthControl } from './components/LengthControl'
import { UuidList } from './components/UuidList'

const COUNT_OPTIONS = [1, 5, 10, 25, 50] as const

function PillToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[]
  value: T
  onChange: (val: T) => void
}) {
  return (
    <div className="flex gap-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-[6px] border-[0.5px] px-3 py-1 text-[15px] capitalize ${
            value === option
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

export default function UuidGenerator() {
  useDocumentTitle('UUID Generator — jayTools')
  const [length, setLength] = usePreference<number>('pref:uuid:length', LIMITS.UUID_LENGTH_DEFAULT)
  const [format, setFormat] = usePreference<'hyphen' | 'no-hyphen'>('pref:uuid:format', 'hyphen')
  const [caseOption, setCaseOption] = usePreference<'lower' | 'upper'>('pref:uuid:case', 'lower')
  const [count, setCount] = usePreference<number>('pref:uuid:count', 1)
  const [version, setVersion] = usePreference<'v4' | 'v7'>('pref:uuid:version', 'v4')
  const [nonce, setNonce] = useState(0)

  const ids = useMemo(
    () =>
      generateIds({
        length,
        version,
        hyphens: format === 'hyphen',
        uppercase: caseOption === 'upper',
        count,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [length, format, caseOption, count, version, nonce]
  )

  const generate = () => setNonce((n) => n + 1)

  useKeyboardShortcut('ctrl+shift+g', generate)

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-6">
      <div className="flex flex-wrap items-center gap-4">
        <LengthControl length={length} onChange={setLength} />
        {length === 32 && (
          <PillToggle options={['v4', 'v7'] as const} value={version} onChange={setVersion} />
        )}
        <PillToggle
          options={['hyphen', 'no-hyphen'] as const}
          value={format}
          onChange={setFormat}
        />
        <PillToggle options={['lower', 'upper'] as const} value={caseOption} onChange={setCaseOption} />
        <div className="flex gap-1">
          {COUNT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCount(option)}
              className={`rounded-[6px] border-[0.5px] px-3 py-1 text-[15px] ${
                count === option
                  ? 'border-[#7c6ff7] bg-[#7c6ff7] text-[#e6edf3]'
                  : 'border-[#30363d] bg-transparent text-[#8b949e]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        title="Ctrl+Shift+G"
        className="flex w-fit items-center gap-2 rounded-[6px] bg-[#7c6ff7] px-4 py-1.5 text-[16px] text-[#e6edf3] hover:bg-[#4f46a0]"
      >
        <RefreshCw size={14} />
        Generate
      </button>

      <UuidList ids={ids} />
    </div>
  )
}
