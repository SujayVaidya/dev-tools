import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/json', label: 'JSON' },
  { to: '/diff', label: 'Diff' },
  { to: '/base64', label: 'Base64' },
  { to: '/hash', label: 'Hash' },
  { to: '/regex', label: 'Regex' },
  { to: '/uuid', label: 'UUID' },
]

export function Nav() {
  return (
    <nav className="flex h-16 shrink-0 items-center justify-between border-b-[0.5px] border-[#30363d] bg-[#0d0d0f] px-6">
      <div className="flex items-center gap-2 text-[17px]">
        <span className="text-[#7c6ff7]">j{'{}'}</span>
        <span className="text-[#e6edf3]">jayTools</span>
      </div>
      <div className="flex items-center gap-5 text-[15px]">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `border-b pb-[15px] pt-[15px] ${
                isActive
                  ? 'border-[#7c6ff7] text-[#e6edf3]'
                  : 'border-transparent text-[#8b949e] hover:text-[#e6edf3]'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
