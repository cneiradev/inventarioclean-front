import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import './pages/Login'
import Home from './pages/Home'
import Usuarios from './pages/Usuarios'
import UsuarioForm from './pages/UsuarioForm'
import Inventario from './pages/Inventario'
import ProductoForm from './pages/ProductoForm'
import ProductoModificar from './pages/ProductoModificar'
import ProductoEliminar from './pages/ProductoEliminar'
import Auditoria from './pages/Auditoria'
import type { Rol } from './types'
import Login from './pages/Login'

/**
 * Rutas de la aplicacion.
 *
 * <p>Los roles de cada seccion salen del documento de requerimientos y estan
 * reflejados en ProtectedRoute. El menu lateral (lib/menu.ts) usa la misma
 * distribucion: si se cambia uno hay que cambiar el otro.
 */
const ROLES: Record<string, Rol> = {
  admin: 'ADMINISTRADOR',
  operador: 'OPERADOR',
}

/** Solo el administrador. */
const ADMIN = [ROLES.admin]
/** Administrador y operador. */
const LECTURA = [ROLES.admin, ROLES.operador]

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Home: lo ven los dos roles. */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* --- Inventario --- */}
      {/* Administrador edita; operador consulta. El backend aplica el
          permiso real igual. */}
      <Route
        path="/inventario"
        element={
          <ProtectedRoute roles={LECTURA}>
            <Inventario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventario/nuevo"
        element={
          <ProtectedRoute roles={ADMIN}>
            <ProductoForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventario/modificar"
        element={
          <ProtectedRoute roles={ADMIN}>
            <ProductoModificar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventario/eliminar"
        element={
          <ProtectedRoute roles={ADMIN}>
            <ProductoEliminar />
          </ProtectedRoute>
        }
      />

      {/* --- Usuarios (solo ADMINISTRADOR) --- */}
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute roles={ADMIN}>
            <Usuarios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios/nuevo"
        element={
          <ProtectedRoute roles={ADMIN}>
            <UsuarioForm />
          </ProtectedRoute>
        }
      />
      {/* La misma pantalla sirve para editar: se llega con ?username=... */}
      <Route
        path="/usuarios/modificar"
        element={
          <ProtectedRoute roles={ADMIN}>
            <UsuarioForm />
          </ProtectedRoute>
        }
      />

      {/* --- Registro de acciones (solo ADMINISTRADOR) --- */}
      <Route
        path="/auditoria"
        element={
          <ProtectedRoute roles={ADMIN}>
            <Auditoria />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
