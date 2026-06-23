import { useState } from 'react'
import { fetchUrl } from '@/lib/urlFetch'

interface UrlFetchInputProps {
  onFetch: (text: string) => void
  onError: (msg: string) => void
}

export function UrlFetchInput({ onFetch, onError }: UrlFetchInputProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    setLoading(true)
    const result = await fetchUrl(url)
    setLoading(false)
    if ('error' in result) {
      onError(result.error)
    } else {
      onFetch(result.text)
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/data.json"
        className="flex-1 rounded-[6px] border-[0.5px] border-[#30363d] bg-[#161b22] px-3 py-1.5 text-[16px] text-[#e6edf3] outline-none placeholder:text-[#484f58]"
      />
      <button
        type="button"
        onClick={handleFetch}
        disabled={loading || !url}
        className="rounded-[6px] border-[0.5px] border-[#30363d] bg-transparent px-3 py-1.5 text-[15px] text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3] disabled:opacity-50"
      >
        {loading ? 'Fetching…' : 'Fetch'}
      </button>
    </div>
  )
}
