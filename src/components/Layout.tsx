import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth as useAuthStore } from '../lib/auth'
import Sidebar from './Sidebar'
import { ROL_ETIQUETA, type Rol } from '../types'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location = useLocation()
  const { usuario } = useAuthStore()

  // Navegar cierra el menu: en pantalla chica taparia el contenido nuevo.
  useEffect(() => {
    setMenuAbierto(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen lg:flex flex-col lg:flex-row">
      {/* Header FIXO: siempre visible en la parte superior */}
      <header className="fixed top-0 left-0 right-0 z-40 left-0 right-0 flex items-center gap-4 bg-cool-steel-50 border-b border-cool-steel-200 py-3 px-4">
        <span className="text-sm font-semibold text-cool-steel-900">INVENTARIO CLEAN</span>

        {/* Indicador de perfil a la derecha */}
        <div className="flex items-center gap-2">
          <span className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cool-steel-100 text-cool-steel-700 text-xs font-semibold">
            {usuario?.iniciales || 'U'}
          </span>
          <span className="text-xs font-medium text-cool-steel-700">
            {usuario?.rol && ROL_ETIQUETA[usuario.rol as Rol]}
          </span>
        </div>
      </header>

      {/* Contenedor principal */}
      <div className="w-full lg:w-auto flex-1 flex flex-col lg:flex-row gap-4 pt-20">
        
        {/* Sidebar fijo: pantalla grande (lg:block) */}
        <div className="hidden lg:block flex-shrink-0 w-64">
          <Sidebar />
        </div>

        {/* Área de contenido */}
        <main className="flex-1 flex flex-col lg:flex-1 overflow-x-auto">
          {/* Mobile menu button hidden on lg */}
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
          <div className="p-4">{children}</div>
        </main>

      </div>
    </div>
  )
}
