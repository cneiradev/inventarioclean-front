import { describe, expect, it } from 'vitest'
import { BIENVENIDA_POR_ROL, DASHBOARD_TITULO, MENU_POR_ROL } from './menu'
import type { Rol } from '../types'

/**
 * Tests de la distribucion de permisos del menu.
 *
 * <p>Esta tabla es la traduccion del documento de requerimientos a la
 * navegacion. Si alguien cambia una regla de permisos sin querer, el usuario
 * ve secciones que no le corresponden (o deja de ver las que si), asi que
 * queda fijada por tests.
 *
 * <p>Recordatorio: esto es navegacion, no seguridad. El permiso real lo
 * aplica el backend. Estos tests evitan el error de permisos en la UI, no un
 * acceso indebido.
 */

const ROLES: Rol[] = ['ADMINISTRADOR', 'OPERADOR']

describe('menu por rol', () => {
  it('los dos roles tienen menu y textos de bienvenida', () => {
    for (const rol of ROLES) {
      expect(MENU_POR_ROL[rol].length).toBeGreaterThan(0)
      expect(BIENVENIDA_POR_ROL[rol]).toBeTruthy()
      expect(DASHBOARD_TITULO[rol]).toBeTruthy()
    }
  })

  it('ADMINISTRADOR ve gestion de usuarios y las tres acciones de producto', () => {
    const rutas = MENU_POR_ROL.ADMINISTRADOR.map((i) => i.path)

    expect(rutas).toContain('/inventario')
    expect(rutas).toContain('/inventario/nuevo')      // agregar
    expect(rutas).toContain('/inventario/modificar')  // modificar
    expect(rutas).toContain('/inventario/eliminar')   // eliminar
    expect(rutas).toContain('/usuarios')              // gestion de usuarios
  })

  it('OPERADOR ve inicio e inventario, y NO la gestion de usuarios', () => {
    const rutas = MENU_POR_ROL.OPERADOR.map((i) => i.path)

    expect(rutas).toContain('/')
    expect(rutas).toContain('/inventario')

    // El operador NO administra usuarios ni borra productos.
    expect(rutas).not.toContain('/usuarios')
    expect(rutas).not.toContain('/inventario/eliminar')
    expect(rutas).not.toContain('/inventario/nuevo')
  })

  it('todos los roles parten por Inicio', () => {
    for (const rol of ROLES) {
      expect(MENU_POR_ROL[rol][0].path).toBe('/')
    }
  })

  it('no hay rutas repetidas dentro de un mismo menu', () => {
    for (const rol of ROLES) {
      const rutas = MENU_POR_ROL[rol].map((i) => i.path)
      expect(new Set(rutas).size).toBe(rutas.length)
    }
  })

  it('ADMINISTRADOR no ve secciones de renta ni venta', () => {
    const rutas = MENU_POR_ROL.ADMINISTRADOR.map((i) => i.path)

    expect(rutas).not.toContain('/renta/nueva')
    expect(rutas).not.toContain('/venta/nueva')
  })

  it('el registro de acciones es solo del ADMINISTRADOR', () => {
    // El documento pide que el registro quede "de manera interna".
    expect(MENU_POR_ROL.ADMINISTRADOR.map((i) => i.path)).toContain('/auditoria')
    expect(MENU_POR_ROL.OPERADOR.map((i) => i.path)).not.toContain('/auditoria')
  })

  it('el operador no entra a la gestion de usuarios', () => {
    const rutas = MENU_POR_ROL.OPERADOR.map((i) => i.path)

    expect(rutas).not.toContain('/usuarios')
    expect(rutas).not.toContain('/usuarios/nuevo')
    expect(rutas).not.toContain('/usuarios/modificar')
  })
})