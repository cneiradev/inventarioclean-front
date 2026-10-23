import { Navigate, useLocation } from 'react-router-dom'
import Layout from './Layout'
import { useAuth } from '../lib/auth'
import type { Rol } from '../types'

/**
 * Guard de rutas privadas.
 *
 * <p>Tres situaciones, en este orden:
 * <ul>
 *   <li>Sin sesion -&gt; al login, guardando a donde iba el usuario.</li>
 *   <li>Sesion iniciada pero rol sin permiso -&gt; pantalla de "sin permiso".</li>
 *   <li>Todo bien -&gt; renderiza la pagina dentro del layout.</li>
 * </ul>
 *
 * <p>Importante: esto NO es seguridad, solo navegacion. Si alguien fuerza la
 * ruta, el backend sigue rechazando la operacion con 403 porque ahi esta el
 * @PreAuthorize. El guard evita que el usuario llegue a una pantalla vacia,
 * nada mas.
 */
export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode
  /** Si se omite, cualquier rol autenticado puede entrar. */
  roles?: Rol[]
}) {
  const { usuario, cargando } = useAuth()
  const location = useLocation()

  // Mientras se revalida el token no se decide nada: redirigir aqui mandaria
  // al login a un usuario que si tiene sesion, en cada recarga.
  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Cargando...</p>
      </div>
    )
  }

  if (!usuario) {
    // `state.from` permite volver a la pagina que el usuario intentaba abrir.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <SinPermiso />
  }

  return <Layout>{children}</Layout>
}

function SinPermiso() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Sin permiso</h1>
        <p className="mt-2 text-sm text-slate-600">
          Tu rol no tiene acceso a esta seccion. Si necesitas entrar, pide al
          administrador que ajuste tus permisos.
        </p>
      </div>
    </div>
  )
}