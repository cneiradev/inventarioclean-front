import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productosApi } from '../lib/endpoints'
import { useAvisos } from '../lib/avisos'
import { useAuth } from '../lib/auth'
import { ApiError } from '../lib/api'
import { Badge, Button, Card, Cargando, Input, Vacio } from '../components/ui'
import type { Producto, TipoComercio } from '../types'

/**
 * Tabla del inventario, con pestanas de venta y renta.
 *
 * <p>La lectura de stock es lo mas importante de esta pantalla, asi que el
 * disponible se muestra siempre junto al total, y se marca cuando esta bajo
 * el minimo configurado. Ese "stock bajo" lo calcula el backend: el
 * frontend solo lo muestra, para que las dos copias del criterio no se
 * desincronicen.
 *
 * <p>Solo el ADMINISTRADOR puede editar; el operador ve la tabla en solo
 * lectura. El backend aplica el permiso real aunque se fuerce la URL.
 */
export default function Inventario() {
  const { error } = useAvisos()
  const { usuario } = useAuth()

  /** Solo el ADMINISTRADOR recibe true; el resto ve la tabla sin acciones. */
  const editable = usuario?.rol === 'ADMINISTRADOR'

  const [tipo, setTipo] = useState<TipoComercio>('VENTA')
  const [texto, setTexto] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [soloBajo, setSoloBajo] = useState(false)
  const [pagina, setPagina] = useState(0)

  const [productos, setProductos] = useState<Producto[] | null>(null)
  const [total, setTotal] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)

  const cargar = useCallback(async () => {
    try {
      const respuesta = await productosApi.listar({
        tipo,
        texto: busqueda,
        soloBajo,
        pagina,
        porPagina: 20,
      })
      setProductos(respuesta.content)
      setTotal(respuesta.totalElements)
      setTotalPaginas(respuesta.totalPages)
    } catch (e) {
      error(e instanceof ApiError ? e.message : 'No se pudo cargar el inventario')
      setProductos([])
    }
  }, [tipo, busqueda, soloBajo, pagina, error])

  useEffect(() => {
    cargar()
  }, [cargar])

  function buscar(e: React.FormEvent) {
    e.preventDefault()
    setBusqueda(texto.trim())
    setPagina(0)
  }
return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {editable ? 'Inventario' : `Articulos en ${tipo === 'VENTA' ? 'venta' : 'renta'}`}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {total} {total === 1 ? 'producto' : 'productos'} en el listado.
          </p>
        </div>
        {editable && (
          <div className="flex gap-2">
            <Link to="/inventario/nuevo">
              <Button>Agregar producto</Button>
            </Link>
            <Link to="/inventario/modificar">
              <Button variante="secundario">Modificar</Button>
            </Link>
            <Link to="/inventario/eliminar">
              <Button variante="peligro">Eliminar</Button>
            </Link>
          </div>
        )}
      </div>

      <Card>
        {/* Pestanas venta / renta, como pide el documento. */}
        <div className="border-b border-slate-200 px-5">
          <div className="flex gap-1">
            {(['VENTA', 'RENTA'] as TipoComercio[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTipo(t)
                  setPagina(0)
                }}
                className={[
                  'border-b-2 px-4 py-3 text-sm font-medium transition',
                  tipo === t
                    ? 'border-marca-600 text-marca-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                Articulos en {t === 'VENTA' ? 'venta' : 'renta'}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={buscar}
          className="flex flex-wrap items-end gap-3 border-b border-slate-200 p-4"
        >
          <div className="min-w-56 flex-1">
            <label htmlFor="buscar" className="block text-xs font-medium text-slate-600">
              Buscar por SKU o nombre
            </label>
            <Input
              id="buscar"
              className="mt-1"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Ej: silla"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={soloBajo}
              onChange={(e) => {
                setSoloBajo(e.target.checked)
                setPagina(0)
              }}
              className="h-4 w-4 rounded border-slate-300"
            />
            Solo stock bajo
          </label>

          <Button type="submit" variante="secundario">
            Buscar
          </Button>
        </form>

        {productos === null ? (
          <Cargando />
        ) : productos.length === 0 ? (
          <Vacio
            mensaje={
              busqueda || soloBajo
                ? 'No hay productos que coincidan con el filtro.'
                : `Todavia no hay productos en ${tipo === 'VENTA' ? 'venta' : 'renta'}.`
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {columnas.map((c) => (
                    <th key={c} className="px-4 py-3 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.nombre}
                        {p.stockBajo && <Badge tono="peligro">Stock bajo</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.medidas ?? '-'}</td>
                    <td className="px-4 py-3">{p.cantidadTotal}</td>
                    <td className="px-4 py-3 font-medium">{p.cantidadDisponible}</td>
                    <td className="px-4 py-3">
                      ${p.precio.toLocaleString('es-CL', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tono={p.estado === 'EN_BODEGA' ? 'exito' : 'alerta'}>
                        {p.estado === 'EN_BODEGA' ? 'En bodega' : 'Arrendado'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm">
            <span className="text-slate-500">
              Pagina {pagina + 1} de {totalPaginas}
            </span>
            <div className="flex gap-2">
              <Button
                variante="secundario"
                disabled={pagina === 0}
                onClick={() => setPagina((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variante="secundario"
                disabled={pagina >= totalPaginas - 1}
                onClick={() => setPagina((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

  const columnas = ['SKU', 'Nombre', 'Medidas', 'Total', 'Disponible', 'Precio', 'Estado']