import type { Rol } from '../types'

export type ItemMenu = {
  path: string
  etiqueta: string
}

export const MENU_POR_ROL: Record<Rol, ItemMenu[]> = {
  ADMINISTRADOR: [
    { path: '/', etiqueta: 'Inicio' },
    { path: '/inventario', etiqueta: 'Administrador de sistemas' },
    { path: '/inventario/nuevo', etiqueta: 'Agregar nuevo producto' },
    { path: '/inventario/modificar', etiqueta: 'Modificar producto' },
    { path: '/inventario/eliminar', etiqueta: 'Eliminar producto' },
    { path: '/usuarios', etiqueta: 'Gestion de usuarios' },
    { path: '/usuarios/nuevo', etiqueta: 'Agregar nuevo usuario' },
    { path: '/usuarios/modificar', etiqueta: 'Modificar usuario' },
    { path: '/auditoria', etiqueta: 'Registro de acciones' },
  ],
  OPERADOR: [
    { path: '/', etiqueta: 'Productos' },
    { path: '/inventario', etiqueta: 'Inventario' },
  ],
}

export const BIENVENIDA_POR_ROL: Record<Rol, string> = {
  ADMINISTRADOR: 'Aqui podras revisar y administrar el inventario y bodega.',
  OPERADOR: 'Aqui podras revisar el stock y el inventario disponible.',
}

export const DASHBOARD_TITULO: Record<Rol, string> = {
  ADMINISTRADOR: 'Productos con stock bajo',
  OPERADOR: 'Productos con stock bajo',
}
