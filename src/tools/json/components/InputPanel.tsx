import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ByteCounter } from '@/components/ByteCounter'
import { LimitBanner } from '@/components/LimitBanner'
import { DropZone } from '@/components/DropZone'
import { UrlFetchInput } from '@/components/UrlFetchInput'
import { LIMITS } from '@/lib/limits'
import { ERRORS } from '@/lib/errors'

interface InputPanelProps {
  value: string
  onChange: (value: string) => void
  parseError: { line: number; col: number } | null
  onFile: (text: string, filename: string) => void
}

export function InputPanel({ value, onChange, parseError, onFile }: InputPanelProps) {
  const [bannerError, setBannerError] = useState<string | null>(null)
  const byteLength = new TextEncoder().encode(value).length

  const handlePasteChange = (next: string) => {
    if (new TextEncoder().encode(next).length > LIMITS.PASTE_BYTES) {
      setBannerError(ERRORS.PASTE_TOO_LARGE)
      return
    }
    setBannerError(null)
    onChange(next)
  }

  const [activeTab, setActiveTab] = useState('paste')
  const triggerStyle = (tab: string) => ({
    backgroundColor: activeTab === tab ? '#161b22' : 'transparent',
    color: activeTab === tab ? '#e6edf3' : '#8b949e',
  })

  return (
    <Tabs defaultValue="paste" onValueChange={setActiveTab} className="flex h-full flex-col">
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
          placeholder="Paste JSON here…"
          spellCheck={false}
          className={`min-h-0 flex-1 resize-none rounded-[6px] border-[0.5px] bg-[#161b22] p-3 font-mono text-[16px] text-[#e6edf3] outline-none placeholder:text-[#484f58] ${
            parseError ? 'border-l-2 border-l-[#f85149] border-y-[#30363d] border-r-[#30363d]' : 'border-[#30363d]'
          }`}
        />
        <ByteCounter bytes={byteLength} maxBytes={LIMITS.PASTE_BYTES} />
        {bannerError && <LimitBanner message={bannerError} onDismiss={() => setBannerError(null)} />}
        {parseError && (
          <LimitBanner message={ERRORS.JSON_INVALID(parseError.line, parseError.col)} />
        )}
      </TabsContent>

      <TabsContent value="upload" className="px-3 pb-2">
        <DropZone accept=".json,application/json" onFile={(text, name) => onFile(text, name)} />
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
