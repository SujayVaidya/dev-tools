import type { IndentOption } from '../jsonUtils'

interface ToolbarProps {
  mode: 'format' | 'minify'
  onFormat: () => void
  onMinify: () => void
  indent: IndentOption
  onIndentChange: (value: IndentOption) => void
  wrap: boolean
  onWrapToggle: () => void
  onDownload: () => void
  onClear: () => void
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-[6px] border-[0.5px] px-2.5 py-1 text-[15px] transition-colors duration-150 ${
        active
          ? 'border-[#7c6ff7] text-[#7c6ff7]'
          : 'border-[#30363d] bg-transparent text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]'
      }`}
    >
      {children}
    </button>
  )
}

export function Toolbar({
  mode,
  onFormat,
  onMinify,
  indent,
  onIndentChange,
  wrap,
  onWrapToggle,
  onDownload,
  onClear,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 rounded-[10px] border-[0.5px] border-[#30363d] px-3 py-2">
      <ToolbarButton active={mode === 'format'} onClick={onFormat} title="Ctrl+Shift+F">
        Format
      </ToolbarButton>
      <ToolbarButton active={mode === 'minify'} onClick={onMinify} title="Ctrl+Shift+M">
        Minify
      </ToolbarButton>
      <div className="h-4 w-px bg-[#30363d]" />
      <select
        value={indent}
        onChange={(e) => onIndentChange(e.target.value as IndentOption)}
        className="rounded-[6px] border-[0.5px] border-[#30363d] bg-transparent px-2 py-1 text-[15px] text-[#8b949e]"
      >
        <option value="2">2sp</option>
        <option value="4">4sp</option>
        <option value="tab">tab</option>
      </select>
      <ToolbarButton active={wrap} onClick={onWrapToggle}>
        Wrap
      </ToolbarButton>
      <div className="h-4 w-px bg-[#30363d]" />
      <ToolbarButton onClick={onDownload}>Download</ToolbarButton>
      <ToolbarButton onClick={onClear} title="Ctrl+Shift+Delete">
        Clear
      </ToolbarButton>
    </div>
  )
}
