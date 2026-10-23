import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productosApi } from '../lib/endpoints'
import { useAvisos } from '../lib/avisos'
import { ApiError } from '../lib/api'
import { Badge, Button, Card, Field, Input, Select } from '../components/ui'
import type { EstadoProducto, Producto, TipoComercio } from '../types'

/**
 * Modificar producto por SKU.
 *
 * <p>Flujo que pide el documento: se escribe el SKU, se busca, el sistema
 * trae la informacion actual, se edita y se guarda.
 *
 * <p>El SKU y el disponible se muestran pero NO se editan: el SKU identifica
 * al producto en todo el historial, y el disponible lo gobiernan los
 * movimientos de renta y venta. El administrador si puede corregir el total
 * (por ejemplo, si se conto mal al ingresar), pero no por debajo de lo que ya
 * salio de bodega; eso lo valida el backend.
 */
export default function ProductoModificar() {
  const navegar = useNavigate()
  const { exito, error } = useAvisos()

  const [skuBusqueda, setSkuBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const [producto, setProducto] = useState<Producto | null>(null)

  // Campos editables
  const [nombre, setNombre] = useState('')
  const [medidas, setMedidas] = useState('')
  const [cantidadTotal, setCantidadTotal] = useState('0')
  const [stockMinimo, setStockMinimo] = useState('0')
  const [precio, setPrecio] = useState('')
  const [tipoComercio, setTipoComercio] = useState<TipoComercio>('VENTA')
  const [estado, setEstado] = useState<EstadoProducto>('EN_BODEGA')

  function cargarEnFormulario(p: Producto) {
    setProducto(p)
    setNombre(p.nombre)
    setMedidas(p.medidas ?? '')
    setCantidadTotal(String(p.cantidadTotal))
    setStockMinimo(String(p.stockMinimo))
    setPrecio(String(p.precio))
    setTipoComercio(p.tipoComercio)
    setEstado(p.estado)
  }

  async function buscar(e: React.FormEvent) {
    e.preventDefault()
    if (!skuBusqueda.trim()) return

    setBuscando(true)
    setProducto(null)
    try {
      cargarEnFormulario(await productosApi.buscarPorSku(skuBusqueda.trim()))
    } catch (e) {
      error(e instanceof ApiError ? e.message : 'No se pudo buscar el producto')
    } finally {
      setBuscando(false)
    }
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!producto) return

    setEnviando(true)
    try {
      const actualizado = await productosApi.actualizar(producto.sku, {
        sku: producto.sku,     // nunca cambia
        nombre: nombre.trim(),
        medidas: medidas.trim(),
        cantidadTotal: Number(cantidadTotal),
        stockMinimo: Number(stockMinimo) || 0,
        precio: Number(precio),
        tipoComercio,
        estado,
      })
      exito(`Producto ${actualizado.sku} modificado`)
      navegar('/inventario')
    } catch (e) {
      // El backend explica por que no se pudo (por ejemplo, si el total
      // quedaria por debajo de lo ya rentado).
      error(e instanceof ApiError ? e.message : 'No se pudo guardar el producto')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900">Modificar producto</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ingresa el SKU del producto para cargar su informacion actual.
      </p>

      {/* Paso 1: buscar por SKU. */}
      {!producto && (
        <div className="mt-6 max-w-md">
          <Card titulo="Buscar producto">
            <form onSubmit={buscar} className="space-y-4 p-5">
              <Field label="SKU / Codigo de producto" htmlFor="sku-buscar">
                <Input
                  id="sku-buscar"
                  value={skuBusqueda}
                  onChange={(e) => setSkuBusqueda(e.target.value)}
                  placeholder="Ej: SILLA-001"
                  autoFocus
                />
              </Field>
              <div className="flex gap-2">
                <Button type="submit" disabled={buscando}>
                  {buscando ? 'Buscando...' : 'Buscar'}
                </Button>
                <Button
                  type="button"
                  variante="secundario"
                  onClick={() => navegar('/inventario')}
                >
                  Volver
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Paso 2: editar y guardar. */}
      {producto && (
        <div className="mt-6 max-w-2xl space-y-4">
          <Card titulo={`Producto ${producto.sku}`}>
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3 text-sm">
              <Badge tono="info">SKU: {producto.sku}</Badge>
              <Badge tono={producto.stockBajo ? 'peligro' : 'exito'}>
                {producto.stockBajo ? 'Stock bajo' : 'Stock suficiente'}
              </Badge>
              <span className="text-slate-500">
                Disponible: <strong>{producto.cantidadDisponible}</strong> de{' '}
                {producto.cantidadTotal}
              </span>
            </div>

            <form onSubmit={guardar} className="space-y-4 p-5">
              <Field label="SKU" ayuda="No se puede cambiar">
                <Input value={producto.sku} disabled readOnly />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre del producto" htmlFor="nombre">
                  <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Field>

                <Field label="Medidas" ayuda="Opcional" htmlFor="medidas">
                  <Input id="medidas" value={medidas} onChange={(e) => setMedidas(e.target.value)} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Cantidad total"
                  ayuda="No puede quedar bajo lo ya rentado"
                  htmlFor="cantidad"
                >
                  <Input
                    id="cantidad"
                    type="number"
                    min={0}
                    value={cantidadTotal}
                    onChange={(e) => setCantidadTotal(e.target.value)}
                  />
                </Field>

                <Field label="Stock minimo" htmlFor="stockMinimo">
                  <Input
                    id="stockMinimo"
                    type="number"
                    min={0}
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value)}
                  />
                </Field>

                <Field label="Precio / Valor" htmlFor="precio">
                  <Input
                    id="precio"
                    type="number"
                    min={0}
                    step="0.01"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tipo de comercio" htmlFor="tipo">
                  <Select
                    id="tipo"
                    value={tipoComercio}
                    onChange={(e) => setTipoComercio(e.target.value as TipoComercio)}
                  >
                    <option value="VENTA">Venta</option>
                    <option value="RENTA">Renta</option>
                  </Select>
                </Field>

                <Field label="Estado" htmlFor="estado">
                  <Select
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as EstadoProducto)}
                  >
                    <option value="EN_BODEGA">En bodega</option>
                    <option value="ARRENDADO">Arrendado</option>
                  </Select>
                </Field>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={enviando}>
                  {enviando ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <Button
                  type="button"
                  variante="secundario"
                  onClick={() => setProducto(null)}
                >
                  Buscar otro
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
