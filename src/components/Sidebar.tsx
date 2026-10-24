import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useEffect } from 'react'
import { MENU_POR_ROL } from '../lib/menu'
import { ROL_ETIQUETA } from '../types'

export default function Sidebar() {
  const { usuario, logout } = useAuth()

  if (!usuario) return null

  const items = MENU_POR_ROL[usuario.rol]

  useEffect(() => {
    const handlePageHide = () => {
      logout()
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
      logout()
    }

    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [logout])

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-cool-steel-200 bg-cool-steel-50 min-h-screen shadow-lg">
      {/* Brand section with better styling */}
      <div className="border-b border-cool-steel-200 px-5 py-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cool-steel-100 flex items-center justify-center text-cool-steel-700 font-semibold text-xs">
            {usuario?.iniciales || 'U'}
          </div>
          <span className="text-sm font-semibold text-cool-steel-900">Inventario Clean</span>
        </div>
      </div>

      {/* Navigation menu with improved styling */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1 w-full">
          {items.map((item) => (
            <li key={item.path} className="w-full">
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => [
                  'block flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-cool-steel-100 text-cool-steel-700'
                    : 'text-cool-steel-600 hover:bg-cool-steel-50 hover:text-cool-steel-900',
                ].join(' ')}
              >
                <span className="w-4 h-4 rounded-full bg-cool-steel-50 flex-shrink-0 mr-3"></span>
                {item.etiqueta}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button with improved styling */}
      <div className="border-t border-cool-steel-200 p-3">
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-cool-steel-600 transition-all hover:bg-cool-steel-50 hover:text-cool-steel-900"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
