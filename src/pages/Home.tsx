import { useEffect, useState } from 'react'
import { dashboardApi } from '../lib/endpoints'
import { useAuth } from '../lib/auth'
import { BIENVENIDA_POR_ROL } from '../lib/menu'
import { Badge, Card, Kpi, Vacio } from '../components/ui'
import { ROL_ETIQUETA } from '../types'
import type { Dashboard } from '../types'

/**
 * Home del usuario logueado.
 *
 * <p>El documento pide: bienvenida con el nombre, descripcion del area, y un
 * dashboard con informacion importante. Los indicadores cambian segun el rol
 * porque lo que importa no es el mismo: al administrador le importa reponer
 * stock y tener el catalogo ordenado; al operador, saber que salio de bodega
 * y que falta por volver.
 *
 * <p>El dashboard lo ven el administrador y el operador.
 */
export default function Home() {
  const { usuario } = useAuth()
  const [datos, setDatos] = useState<Dashboard | null>(null)

  const veDashboard = usuario?.rol === 'ADMINISTRADOR' || usuario?.rol === 'OPERADOR'

  useEffect(() => {
    if (!veDashboard) return

    let vigente = true
    dashboardApi
      .obtener()
      .then((d) => vigente && setDatos(d))
      .catch(() => {
        // Si el panel falla, la app sigue siendo usable: se avisa y el
        // usuario puede seguir con el menu lateral.
        if (vigente) setDatos(null)
      })

    return () => {
      vigente = false
    }
  }, [veDashboard])

  if (!usuario) return null

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Bienvenido {usuario.nombreCompleto}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{BIENVENIDA_POR_ROL[usuario.rol]}</p>
      </div>

      {veDashboard && datos && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            etiqueta="Unidades en bodega"
            valor={datos.unidadesDisponibles}
            detalle={`de ${datos.unidadesDisponibles} en total`}
          />
          <Kpi
            etiqueta="Stock bajo"
            valor={datos.stockBajo}
            detalle={datos.stockBajo > 0 ? 'necesita reposicion' : 'todo en nivel'}
            tono={datos.stockBajo > 0 ? 'peligro' : 'exito'}
          />
          <Kpi
            etiqueta="Productos"
            valor={datos.totalProductos}
            detalle={`${datos.productosVenta} en venta`}
          />
        </section>
      )}

      {veDashboard && datos === null && (
        <Card>
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            No se pudieron cargar los indicadores. Revisa que el backend este
            respondiendo, o sigue con el menu lateral.
          </p>
        </Card>
      )}

      {/* Productos que necesitan reposicion. */}
      {veDashboard && datos && (
        <Card
          titulo="Productos con stock bajo"
          descripcion="Articulos cuyo disponible esta en o por debajo del minimo configurado."
        >
          {datos.productosStockBajo.length === 0 ? (
            <Vacio mensaje="Ningun producto esta bajo el minimo de stock." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">SKU</th>
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium">Comercio</th>
                    <th className="px-4 py-3 font-medium">Disponible</th>
                    <th className="px-4 py-3 font-medium">Minimo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {datos.productosStockBajo.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                      <td className="px-4 py-3">{p.nombre}</td>
                      <td className="px-4 py-3">
                        <Badge tono={p.tipoComercio === 'VENTA' ? 'info' : 'alerta'}>
                          {p.tipoComercio === 'VENTA' ? 'Venta' : 'Renta'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-red-700">
                        {p.cantidadDisponible}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.stockMinimo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
{/* Ultimas operaciones: responde "que paso hace rato". */}
      {veDashboard && datos && datos.ultimasOperaciones.length > 0 && (
        <Card titulo="Ultimas operaciones" descripcion="Movimientos de bodega mas recientes.">
          <ul className="divide-y divide-slate-100">
            {datos.ultimasOperaciones.map((op, i) => (
              <li key={i} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
                <Badge tono="neutro">{op.tipo}</Badge>
                {op.referencia && <span className="font-mono text-xs">{op.referencia}</span>}
                <span className="text-slate-500">por {op.usuario}</span>
                <span className="text-xs text-slate-400">{op.fecha}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="text-xs text-slate-400">
        Sesion de {ROL_ETIQUETA[usuario.rol]} ({usuario.username})
      </p>
    </div>
  )
}
