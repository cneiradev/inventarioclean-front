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
    <aside className="flex w-64 shrink-0 flex-col border-r border-cool-steel-200 bg-cool-steel-50 min-h-screen">
      <div className="border-b border-cool-steel-200 px-5 py-4">
        <p className="text-sm font-semibold text-cool-steel-900">Inventario Clean</p>
        <p className="text-xs text-cool-steel-400">Bodega e inventario</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => [
                  'block rounded-lg px-3 py-2 text-sm transition',
                  isActive
                    ? 'bg-cool-steel-100 font-medium text-cool-steel-700'
                    : 'text-cool-steel-600 hover:bg-cool-steel-100',
                ].join(' ')}
              >
                {item.etiqueta}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-3">
           <button
          type="button"
          onClick={logout}
          className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-700"
        >
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}
