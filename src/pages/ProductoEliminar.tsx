import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productosApi } from '../lib/endpoints'
import { useAvisos } from '../lib/avisos'
import { ApiError } from '../lib/api'
import { Badge, Button, Card, Field, Input } from '../components/ui'
import ModalConfirmar from '../components/ModalConfirmar'
import type { Producto } from '../types'

/**
 * Eliminar producto por SKU.
 *
 * <p>El documento pide que al ingresar el codigo se muestre el nombre del
 * producto que se va a eliminar y se pregunte si esta seguro. Por eso son
 * dos pasos: primero se busca y se muestra que se va a borrar, y solo despues
 * se pide la confirmacion.
 *
 * <p>La eliminacion es logica: el producto desaparece del inventario pero su
 * historial de renta y venta queda, para poder resolver dudas a futuro.
 */
export default function ProductoEliminar() {
  const navegar = useNavigate()
  const { exito, error } = useAvisos()

  const [skuBusqueda, setSkuBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const [producto, setProducto] = useState<Producto | null>(null)
  const [confirmando, setConfirmando] = useState(false)

  async function buscar(e: React.FormEvent) {
    e.preventDefault()
    if (!skuBusqueda.trim()) return

    setBuscando(true)
    setProducto(null)
    try {
      setProducto(await productosApi.buscarPorSku(skuBusqueda.trim()))
    } catch (e) {
      error(e instanceof ApiError ? e.message : 'No se pudo buscar el producto')
    } finally {
      setBuscando(false)
    }
  }

  async function confirmar() {
    if (!producto) return

    setEliminando(true)
    try {
      await productosApi.eliminar(producto.sku)
      exito(`Producto ${producto.sku} eliminado`)
      setConfirmando(false)
      setProducto(null)
      setSkuBusqueda('')
    } catch (e) {
      error(e instanceof ApiError ? e.message : 'No se pudo eliminar el producto')
      setConfirmando(false)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900">Eliminar producto</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ingresa el SKU del producto que quieres eliminar.
      </p>

      <div className="mt-6 max-w-2xl space-y-4">
        <Card titulo="Buscar producto">
          <form onSubmit={buscar} className="space-y-4 p-5">
            <Field label="SKU / Codigo de producto" htmlFor="sku-buscar">
              <Input
                id="sku-buscar"
                value={skuBusqueda}
                onChange={(e) => setSkuBusqueda(e.target.value)}
                placeholder="Ej: SILLA-001"
                disabled={Boolean(producto)}
                autoFocus
              />
            </Field>

            <div className="flex gap-2">
              <Button type="submit" disabled={buscando || Boolean(producto)}>
                {buscando ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button
                type="button"
                variante="secundario"
                onClick={() => navegar('/inventario')}
              >
                Volver al inventario
              </Button>
            </div>
          </form>
        </Card>

        {/* Resumen del producto encontrado, antes de preguntar. */}
        {producto && (
          <Card titulo="Producto encontrado">
            <dl className="grid gap-3 p-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">SKU</dt>
                <dd className="font-mono text-xs">{producto.sku}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Nombre</dt>
                <dd className="font-medium">{producto.nombre}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Tipo de comercio
                </dt>
                <dd>
                  <Badge tono="info">
                    {producto.tipoComercio === 'VENTA' ? 'Venta' : 'Renta'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Cantidad</dt>
                <dd>
                  {producto.cantidadTotal} total / {producto.cantidadDisponible} disponible
                </dd>
              </div>
            </dl>

            <div className="flex gap-2 border-t border-slate-200 p-5">
              <Button variante="peligro" onClick={() => setConfirmando(true)}>
                Eliminar producto
              </Button>
              <Button variante="secundario" onClick={() => setProducto(null)}>
                Cancelar
              </Button>
            </div>
          </Card>
        )}
      </div>

      {confirmando && producto && (
        <ModalConfirmar
          titulo="Confirmar eliminacion"
          mensaje={
            <>
              Estas seguro de eliminar{' '}
              <strong>
                {producto.nombre} ({producto.sku})
              </strong>?
              <br />
              <span className="text-slate-500">
                Dejara de aparecer en el inventario. Su historial de renta y
                venta se conserva.
              </span>
            </>
          }
          onConfirmar={confirmar}
          onCancelar={() => setConfirmando(false)}
          procesando={eliminando}
        />
      )}
    </div>
  )
}