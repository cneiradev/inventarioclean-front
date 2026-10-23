import type { Rol } from '../types'

/**
 * Menu lateral por rol, segun el documento de requerimientos.
 *
 * <p>Esta tabla define QUE ve cada rol. Es la unica fuente de verdad de la
 * navegacion: el Sidebar dibuja lo que sale de aqui, y las rutas validan que
 * el rol tenga permiso. Si se agrega una seccion, se agrega aqui.
 *
 * <p>Recordatorio importante: ocultar un enlace NO es seguridad. El backend
 * aplica el permiso real con @PreAuthorize. Esto es solo navegacion.
 */

export type ItemMenu = {
  path: string
  etiqueta: string
}

export const MENU_POR_ROL: Record<Rol, ItemMenu[]> = {
  ADMINISTRADOR: [
    { path: '/', etiqueta: 'Inicio' },
    { path: '/inventario', etiqueta: 'Inventario' },
    { path: '/inventario/nuevo', etiqueta: 'Agregar nuevo producto' },
    { path: '/inventario/modificar', etiqueta: 'Modificar producto' },
    { path: '/inventario/eliminar', etiqueta: 'Eliminar producto' },
    { path: '/usuarios', etiqueta: 'Gestion de usuarios' },
    { path: '/usuarios/nuevo', etiqueta: 'Agregar nuevo usuario' },
    { path: '/usuarios/modificar', etiqueta: 'Modificar usuario' },
    // El documento pide que el registro de acciones quede guardado "de manera
    // interna": solo el administrador lo consulta.
    { path: '/auditoria', etiqueta: 'Registro de acciones' },
  ],

  OPERADOR: [
    { path: '/', etiqueta: 'Inicio' },
    { path: '/inventario', etiqueta: 'Inventario' },
  ],
}

/**
 * Texto de bienvenida del Home, por rol. El documento pide "BIENVENIDO
 * (Nombre de usuario logueado)" mas una descripcion del area.
 */
export const BIENVENIDA_POR_ROL: Record<Rol, string> = {
  ADMINISTRADOR:
    'Aqui podras revisar y administrar el inventario y bodega.',
  OPERADOR: 'Aqui podras revisar el stock y el inventario disponible.',
}

/** Titulo del area principal de cada sesion, por rol. */
export const DASHBOARD_TITULO: Record<Rol, string> = {
  ADMINISTRADOR: 'Productos con stock bajo',
  OPERADOR: 'Productos con stock bajo',
}