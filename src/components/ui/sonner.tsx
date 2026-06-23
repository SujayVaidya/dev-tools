import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      visibleToasts={3}
      duration={3000}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': '#161b22',
          '--normal-text': '#e6edf3',
          '--normal-border': '#30363d',
          '--border-radius': '6px',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
