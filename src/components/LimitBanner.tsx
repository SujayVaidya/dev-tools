import { X } from 'lucide-react'

interface LimitBannerProps {
  message: string
  onDismiss?: () => void
}

export function LimitBanner({ message, onDismiss }: LimitBannerProps) {
  return (
    <div
      className="flex items-center justify-between gap-2 rounded-[6px] border-[0.5px] border-[#6e1c1c] px-3 py-2 text-[15px] text-[#f85149]"
      style={{ backgroundColor: '#1a0000' }}
    >
      <span>{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="text-[#f85149] hover:opacity-80">
          <X size={13} />
        </button>
      )}
    </div>
  )
}
