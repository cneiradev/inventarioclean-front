import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth as useAuthStore } from '../lib/auth'
import Sidebar from './Sidebar'
import { ROL_ETIQUETA, type Rol } from '../types'

/* 
 * Layout base: diseño base de inventario-ar.
 * - Sidebar fija en desktop (hidden lg:block)
 * - Sidebar desplegable en mobile con overlay
 * - Header con bg-white y borde slate
 */

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location = useLocation()
  const { usuario } = useAuthStore()

  useEffect(() => {
    setMenuAbierto(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen lg:flex flex-col lg:flex-row">
      {/* Barra superior: solo en pantallas chicas. */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuAbierto(true)}
          className="flex items-center gap-2 text-sm text-slate-700"
          aria-label="Abrir menu"
          aria-expanded={menuAbierto}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menu
        </button>
        <span className="text-sm font-semibold text-slate-900">INVENTARIO CLEAN</span>
      </div>

      {/* Sidebar fijo: pantalla grande. */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar desplegable: pantalla chica, sobre el contenido. */}
      {menuAbierto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/30"
            onClick={() => setMenuAbierto(false)}
            aria-label="Cerrar menu"
          />
          <div className="absolute left-0 top-0 h-screen w-64 shadow-lg">
            <Sidebar />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1 overflow-x-auto">{children}</main>
    </div>
  )
}