/** Tipos compartidos con la API. Deben calcar los DTOs de Spring. */

export type Rol = 'ADMINISTRADOR' | 'OPERADOR'

export type TipoComercio = 'VENTA' | 'RENTA'

export type EstadoProducto = 'EN_BODEGA' | 'ARRENDADO'

/** Datos del usuario en sesion. Calca UsuarioActualResponse de Spring. */
export type UsuarioActual = {
  usuarioId: number
  username: string
  nombre: string
  apellido: string
  nombreCompleto: string
  iniciales: string
  rol: Rol
}

/** Respuesta del login: token + datos del usuario. */
export type LoginResponse = UsuarioActual & {
  token: string
  tipoToken: string
}

export type Producto = {
  id: number
  sku: string
  nombre: string
  medidas: string | null
  cantidadTotal: number
  cantidadDisponible: number
  precio: number
  tipoComercio: TipoComercio
  estado: EstadoProducto
  stockMinimo: number
  activo: boolean
  stockBajo: boolean
}

/** Respuesta paginada de Spring Data. */
export type Pagina<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export type Usuario = {
  id: number
  username: string
  nombre: string
  apellido: string
  nombreCompleto: string
  iniciales: string
  email: string
  rol: Rol
  activo: boolean
}

export type AccionAuditoria =
  | 'CREAR_USUARIO'
  | 'MODIFICAR_USUARIO'
  | 'ELIMINAR_USUARIO'
  | 'CREAR_PRODUCTO'
  | 'MODIFICAR_PRODUCTO'
  | 'ELIMINAR_PRODUCTO'
  | 'AJUSTAR_STOCK'

export type RegistroAuditoria = {
  id: number
  usuarioId: number | null
  username: string
  accion: AccionAuditoria
  entidad: string
  entidadId: number | null
  detalle: string | null
  ip: string | null
  createdAt: string
}

/** Indicadores del panel principal. */
export type Dashboard = {
  totalProductos: number
  productosVenta: number
  stockBajo: number
  unidadesDisponibles: number
  productosStockBajo: {
    id: number
    sku: string
    nombre: string
    tipoComercio: TipoComercio
    cantidadDisponible: number
    stockMinimo: number
  }[]
  ultimasOperaciones: {
    tipo: string
    referencia: string
    usuario: string
    fecha: string
  }[]
}

/** Etiquetas legibles de los roles, para mostrar en pantalla. */
export const ROL_ETIQUETA: Record<Rol, string> = {
  ADMINISTRADOR: 'Administrador',
  OPERADOR: 'Operador',
}
