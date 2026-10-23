import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { MENU_POR_ROL } from '../lib/menu'
import { ROL_ETIQUETA } from '../types'

/**
 * Menu lateral izquierdo. Muestra solo las secciones del rol conectado,
 * mas el cierre de sesion que el documento pide para los dos roles.
 */
export default function Sidebar() {
  const { usuario, logout } = useAuth()

  if (!usuario) return null

  const items = MENU_POR_ROL[usuario.rol]

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">Inventario Clean</p>
        <p className="text-xs text-slate-500">Bodega e inventario</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  [
                    'block rounded-lg px-3 py-2 text-sm transition',
                    isActive
                      ? 'bg-marca-50 font-medium text-marca-700'
                      : 'text-slate-600 hover:bg-slate-50',
                  ].join(' ')
                }
              >
                {item.etiqueta}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Usuario logueado y cierre de sesion. */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marca-100 text-xs font-semibold text-marca-700">
            {usuario.iniciales}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {usuario.nombreCompleto}
            </p>
            <p className="truncate text-xs text-slate-500">
              {ROL_ETIQUETA[usuario.rol]}
            </p>
          </div>
        </div>

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