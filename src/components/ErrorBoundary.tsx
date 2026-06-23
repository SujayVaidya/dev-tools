import { Component, type ErrorInfo, type ReactNode } from 'react'
import { idbDel } from '@/lib/storage'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  idbKeys?: string[]
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error(error, info)
    }
  }

  handleReload = (): void => {
    window.location.reload()
  }

  handleClearState = (): void => {
    const keys = this.props.idbKeys ?? []
    Promise.all(keys.map((key) => idbDel(key))).finally(() => window.location.reload())
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-[#8b949e]">
          <p className="text-[16px]">Something went wrong in this tool.</p>
          <div className="flex gap-2">
            {this.props.idbKeys && this.props.idbKeys.length > 0 && (
              <button
                onClick={this.handleClearState}
                className="rounded-[6px] border-[0.5px] border-[#30363d] bg-transparent px-3 py-1.5 text-[15px] text-[#e6edf3] hover:bg-[#161b22]"
              >
                Clear state
              </button>
            )}
            <button
              onClick={this.handleReload}
              className="rounded-[6px] border-[0.5px] border-[#30363d] bg-transparent px-3 py-1.5 text-[15px] text-[#e6edf3] hover:bg-[#161b22]"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
