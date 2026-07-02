import { useState, type RefObject } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ByteCounter } from '@/components/ByteCounter'
import { LimitBanner } from '@/components/LimitBanner'
import { DropZone } from '@/components/DropZone'
import { UrlFetchInput } from '@/components/UrlFetchInput'
import { LIMITS } from '@/lib/limits'
import { ERRORS } from '@/lib/errors'
import type { DiffRow } from '../diffUtils'

const ROW_COLORS: Record<DiffRow['type'], { bg: string; border: string; text: string }> = {
  added: { bg: '#0d1e0d', border: '#3fb950', text: '#3fb950' },
  removed: { bg: '#1e0d0d', border: '#f85149', text: '#f85149' },
  changed: { bg: '#1e1500', border: '#d29922', text: '#e6edf3' },
  unchanged: { bg: 'transparent', border: 'transparent', text: '#8b949e' },
}

interface DiffPaneProps {
  label: string
  value: string
  onChange: (value: string) => void
  rows: DiffRow[] | null
  side: 'left' | 'right'
  wrap: boolean
  scrollRef?: RefObject<HTMLDivElement | null>
}

export function DiffPane({ label, value, onChange, rows, side, wrap, scrollRef }: DiffPaneProps) {
  const [bannerError, setBannerError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('paste')
  const byteLength = new TextEncoder().encode(value).length

  const handlePasteChange = (next: string) => {
    if (new TextEncoder().encode(next).length > LIMITS.PASTE_BYTES) {
      setBannerError(ERRORS.PASTE_TOO_LARGE)
      return
    }
    setBannerError(null)
    onChange(next)
  }

  if (rows) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b-[0.5px] border-[#30363d] px-3 py-2 text-[14px] text-[#8b949e]">
          {label}
        </div>
        <div ref={scrollRef} className={`min-h-0 flex-1 overflow-auto font-mono text-[16px] ${wrap ? '' : 'overflow-x-auto'}`}>
          {rows.map((row, i) => {
            const segments = side === 'left' ? row.left : row.right
            const colors = ROW_COLORS[row.type]
            return (
              <div
                key={i}
                className={`flex h-5 ${wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}
                style={{
                  backgroundColor: segments ? colors.bg : 'transparent',
                  borderLeft: segments && row.type !== 'unchanged' ? `3px solid ${colors.border}` : '3px solid transparent',
                }}
              >
                <span className="w-10 shrink-0 px-2 text-right text-[#484f58]">{i + 1}</span>
                <span style={{ color: segments ? colors.text : undefined }}>
                  {segments?.map((seg, j) => (
                    <span
                      key={j}
                      style={
                        row.type === 'changed'
                          ? { color: seg.type === 'unchanged' ? '#e6edf3' : colors.text }
                          : undefined
                      }
                    >
                      {seg.text}
                    </span>
                  ))}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const triggerStyle = (tab: string) => ({
    backgroundColor: activeTab === tab ? '#161b22' : 'transparent',
    color: activeTab === tab ? '#e6edf3' : '#8b949e',
  })

  return (
    <Tabs defaultValue="paste" onValueChange={setActiveTab} className="flex h-full flex-col">
      <div className="border-b-[0.5px] border-[#30363d] px-3 py-2 text-[14px] text-[#8b949e]">
        {label}
      </div>
      <TabsList className="mx-3 mt-2 w-fit bg-transparent">
        <TabsTrigger value="paste" style={triggerStyle('paste')}>
          Paste
        </TabsTrigger>
        <TabsTrigger value="upload" style={triggerStyle('upload')}>
          Upload
        </TabsTrigger>
        <TabsTrigger value="url" style={triggerStyle('url')}>
          URL
        </TabsTrigger>
      </TabsList>

      <TabsContent value="paste" className="flex min-h-0 flex-1 flex-col gap-1 px-3 pb-2">
        <textarea
          value={value}
          onChange={(e) => handlePasteChange(e.target.value)}
          placeholder="Paste text here…"
          spellCheck={false}
          className="min-h-0 flex-1 resize-none rounded-[6px] border-[0.5px] border-[#30363d] bg-[#161b22] p-3 font-mono text-[16px] text-[#e6edf3] outline-none placeholder:text-[#484f58]"
        />
        <ByteCounter bytes={byteLength} maxBytes={LIMITS.PASTE_BYTES} />
        {bannerError && <LimitBanner message={bannerError} onDismiss={() => setBannerError(null)} />}
      </TabsContent>

      <TabsContent value="upload" className="px-3 pb-2">
        <DropZone onFile={(text) => onChange(text)} />
      </TabsContent>

      <TabsContent value="url" className="px-3 pb-2">
        <UrlFetchInput onFetch={(text) => onChange(text)} onError={(msg) => setBannerError(msg)} />
        {bannerError && (
          <div className="mt-2">
            <LimitBanner message={bannerError} onDismiss={() => setBannerError(null)} />
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
