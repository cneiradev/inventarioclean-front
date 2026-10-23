import { api } from './api'
import type {
  AccionAuditoria,
  Dashboard,
  EstadoProducto,
  Pagina,
  Producto,
  RegistroAuditoria,
  Rol,
  TipoComercio,
  Usuario,
} from '../types'

/**
 * Endpoints de usuarios (solo ADMINISTRADOR).
 *
 * <p>El frontend NO calcula el username: se lo pide al backend generarlo
 * segun la regla del cliente.
 */
export const usuariosApi = {
  listar: () => api<Usuario[]>('/api/usuarios'),

  buscarPorUsername: (username: string) =>
    api<Usuario>(`/api/usuarios/buscar?username=${encodeURIComponent(username)}`),

  crear: (datos: {
    nombre: string
    apellido: string
    email: string
    rol: Rol
    password: string
  }) => api<Usuario>('/api/usuarios', { method: 'POST', body: datos }),

  actualizar: (id: number, datos: {
    nombre: string
    apellido: string
    email: string
    rol: Rol | null
    password: string
  }) => api<Usuario>(`/api/usuarios/${id}`, { method: 'PUT', body: datos }),

  eliminar: (id: number) => api<void>(`/api/usuarios/${id}`, { method: 'DELETE' }),
}

export type FiltroProductos = {
  tipo?: TipoComercio
  texto?: string
  soloBajo?: boolean
  pagina?: number
  porPagina?: number
}

export const productosApi = {
  listar: (filtro: FiltroProductos = {}) => {
    const params = new URLSearchParams()
    if (filtro.tipo) params.set('tipo', filtro.tipo)
    if (filtro.texto) params.set('texto', filtro.texto)
    if (filtro.soloBajo) params.set('soloBajo', 'true')
    params.set('pagina', String(filtro.pagina ?? 0))
    params.set('porPagina', String(filtro.porPagina ?? 20))

    return api<Pagina<Producto>>(`/api/productos?${params}`)
  },

  stockBajo: (tipo?: TipoComercio) => {
    const params = tipo ? `?tipo=${tipo}` : ''
    return api<Producto[]>(`/api/productos/stock-bajo${params}`)
  },

  buscarPorCodigoONombre: (codigo: string) =>
    api<Producto[]>(`/api/productos/buscar?codigo=${encodeURIComponent(codigo)}`),

  buscarPorSku: (sku: string) =>
    api<Producto>(`/api/productos/sku/${encodeURIComponent(sku)}`),

  crear: (datos: {
    sku: string
    nombre: string
    medidas: string
    cantidadTotal: number
    stockMinimo: number
    precio: number
    tipoComercio: TipoComercio
    estado?: EstadoProducto
  }) => api<Producto>('/api/productos', { method: 'POST', body: datos }),

  actualizar: (sku: string, datos: {
    sku: string
    nombre: string
    medidas: string
    cantidadTotal: number
    stockMinimo: number
    precio: number
    tipoComercio: TipoComercio
    estado: EstadoProducto
  }) => api<Producto>(`/api/productos/sku/${encodeURIComponent(sku)}`, {
    method: 'PUT',
    body: datos,
  }),

  eliminar: (sku: string) =>
    api<void>(`/api/productos/sku/${encodeURIComponent(sku)}`, { method: 'DELETE' }),
}

export const auditoriaApi = {
  listar: (accion?: AccionAuditoria, pagina = 0, porPagina = 50) => {
    const params = new URLSearchParams()
    if (accion) params.set('accion', accion)
    params.set('pagina', String(pagina))
    params.set('porPagina', String(porPagina))
    return api<Pagina<RegistroAuditoria>>(`/api/auditoria?${params}`)
  },
}

/** Indicadores del panel principal. */
export const dashboardApi = {
  obtener: () => api<Dashboard>('/api/dashboard'),
}