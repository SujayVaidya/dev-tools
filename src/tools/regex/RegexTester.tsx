import { useEffect, useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { usePreference } from '@/hooks/usePreference'
import { sessGet, sessSet } from '@/lib/storage'
import { ByteCounter } from '@/components/ByteCounter'
import { MatchHighlighter } from './components/MatchHighlighter'
import { computeMatches } from './regexUtils'
import { LIMITS } from '@/lib/limits'

const FLAG_OPTIONS = ['g', 'i', 'm', 's', 'u'] as const
const TEST_STRING_KEY = 'session:regex:test'

export default function RegexTester() {
  useDocumentTitle('Regex Tester — jayTools')
  const [pattern, setPattern] = usePreference('pref:regex:pattern', '')
  const [flags, setFlags] = usePreference('pref:regex:flags', 'g')
  const [testString, setTestString] = useState(() => sessGet(TEST_STRING_KEY, ''))

  const [debounced, setDebounced] = useState({ pattern, flags, testString })

  useEffect(() => {
    const timer = setTimeout(() => setDebounced({ pattern, flags, testString }), 300)
    return () => clearTimeout(timer)
  }, [pattern, flags, testString])

  useEffect(() => {
    sessSet(TEST_STRING_KEY, testString)
  }, [testString])

  const byteLength = new TextEncoder().encode(testString).length
  const tooLarge = byteLength > LIMITS.REGEX_TEST_BYTES

  const { matches, error } = tooLarge
    ? { matches: [], error: null }
    : computeMatches(debounced.pattern, debounced.flags, debounced.testString)

  const toggleFlag = (flag: string) => {
    setFlags(flags.includes(flag) ? flags.replace(flag, '') : flags + flag)
  }

  const maxGroups = matches.reduce((max, m) => Math.max(max, m.length - 1), 0)

  useKeyboardShortcut('ctrl+shift+delete', () => setTestString(''))

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto p-6">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="pattern"
          spellCheck={false}
          className={`flex-1 rounded-[6px] border-[0.5px] bg-[#161b22] px-3 py-1.5 font-mono text-[16px] text-[#e6edf3] outline-none placeholder:text-[#484f58] ${
            error ? 'border-[#f85149]' : 'border-[#30363d]'
          }`}
        />
        <div className="flex gap-1">
          {FLAG_OPTIONS.map((flag) => (
            <button
              key={flag}
              type="button"
              onClick={() => toggleFlag(flag)}
              className={`h-7 w-7 rounded-[6px] border text-[15px] ${
                flags.includes(flag)
                  ? 'border-[#7c6ff7] text-[#7c6ff7]'
                  : 'border-[#30363d] text-[#8b949e]'
              }`}
            >
              {flag}
            </button>
          ))}
        </div>
      </div>
      {error && <div className="text-[15px] text-[#f85149]">{error}</div>}

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#8b949e]">test string</span>
          <ByteCounter bytes={byteLength} maxBytes={LIMITS.REGEX_TEST_BYTES} />
        </div>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          spellCheck={false}
          rows={6}
          className="resize-none rounded-[6px] border-[0.5px] border-[#30363d] bg-[#161b22] p-3 font-mono text-[16px] text-[#e6edf3] outline-none"
        />
      </div>

      <MatchHighlighter text={debounced.testString} matches={tooLarge ? [] : matches} />

      <div className="flex flex-col gap-2">
        {pattern === '' ? (
          <span className="text-[15px] text-[#484f58]">enter a pattern above</span>
        ) : error ? null : matches.length === 0 ? (
          <span className="text-[15px] text-[#484f58]">no matches</span>
        ) : (
          <>
            <span className="text-[15px] text-[#8b949e]">
              <span className="text-[#7c6ff7]">{matches.length}</span> matches found
            </span>
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="bg-[#161b22] text-[#8b949e]">
                  <th className="border-[0.5px] border-[#30363d] px-2 py-1 text-left">#</th>
                  <th className="border-[0.5px] border-[#30363d] px-2 py-1 text-left">Full match</th>
                  {Array.from({ length: maxGroups }, (_, i) => (
                    <th key={i} className="border-[0.5px] border-[#30363d] px-2 py-1 text-left">
                      Group {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matches.map((match, i) => (
                  <tr key={i} className="text-[#e6edf3]">
                    <td className="border-[0.5px] border-[#30363d] px-2 py-1">{i + 1}</td>
                    <td className="border-[0.5px] border-[#30363d] px-2 py-1 font-mono">{match[0]}</td>
                    {Array.from({ length: maxGroups }, (_, g) => (
                      <td key={g} className="border-[0.5px] border-[#30363d] px-2 py-1 font-mono">
                        {match[g + 1] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}
