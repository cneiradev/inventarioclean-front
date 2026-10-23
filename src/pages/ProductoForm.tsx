import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productosApi } from '../lib/endpoints'
import { useAvisos } from '../lib/avisos'
import { ApiError } from '../lib/api'
import { Button, Card, Field, Input, Select } from '../components/ui'
import type { EstadoProducto, TipoComercio } from '../types'

type Errores = Partial<
  Record<'sku' | 'nombre' | 'cantidadTotal' | 'precio' | 'tipoComercio', string>
>

/**
 * Formulario para agregar un producto nuevo.
 *
 * <p>Cubre los campos que pide el documento: SKU/CodigoProducto, nombre,
 * cantidad, medidas, precio/valor, tipo de comercio (renta o venta) y estado.
 *
 * <p>El campo "cantidad disponible" NO se pide: al crear un producto, todo
 * su stock esta disponible. A partir de ahi lo gobiernan los
 * movimientos de renta y venta, no el administrador.
 */
export default function ProductoForm() {
  const navegar = useNavigate()
  const { exito, error } = useAvisos()

  const [sku, setSku] = useState('')
  const [nombre, setNombre] = useState('')
  const [medidas, setMedidas] = useState('')
  const [cantidadTotal, setCantidadTotal] = useState('0')
  const [stockMinimo, setStockMinimo] = useState('0')
  const [precio, setPrecio] = useState('')
  const [tipoComercio, setTipoComercio] = useState<TipoComercio>('VENTA')
  const [estado, setEstado] = useState<EstadoProducto>('EN_BODEGA')

  const [errores, setErrores] = useState<Errores>({})
  const [enviando, setEnviando] = useState(false)

  function validar(): boolean {
    const nuevos: Errores = {}

    if (!sku.trim()) {
      nuevos.sku = 'El SKU es obligatorio'
    } else if (!/^[A-Za-z0-9._-]+$/.test(sku.trim())) {
      nuevos.sku = 'Solo letras, numeros, punto, guion y guion bajo'
    }

    if (!nombre.trim()) nuevos.nombre = 'El nombre es obligatorio'

    const cantidad = Number(cantidadTotal)
    if (!Number.isFinite(cantidad) || cantidad < 0 || !Number.isInteger(cantidad)) {
      nuevos.cantidadTotal = 'La cantidad debe ser un numero entero igual o mayor a 0'
    }

    const valor = Number(precio)
    if (precio.trim() === '' || !Number.isFinite(valor) || valor < 0) {
      nuevos.precio = 'El precio debe ser un numero igual o mayor a 0'
    }

    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return

    setEnviando(true)
    try {
      const creado = await productosApi.crear({
        sku: sku.trim(),
        nombre: nombre.trim(),
        medidas: medidas.trim(),
        cantidadTotal: Number(cantidadTotal),
        stockMinimo: Number(stockMinimo) || 0,
        precio: Number(precio),
        tipoComercio,
        estado,
      })
      exito(`Producto ${creado.sku} agregado`)
      navegar('/inventario')
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.campos) setErrores(e.campos as Errores)
        error(e.message)
      } else {
        error('No se pudo guardar el producto')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900">Agregar nuevo producto</h1>
      <p className="mt-1 text-sm text-slate-500">
        Al guardar, todo el stock indicado queda disponible en bodega.
      </p>

      <div className="mt-6 max-w-2xl">
        <Card titulo="Datos del producto">
          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SKU / Codigo de producto" error={errores.sku} htmlFor="sku">
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Ej: SILLA-001"
                />
              </Field>

              <Field label="Nombre del producto" error={errores.nombre} htmlFor="nombre">
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Silla plegable"
                />
              </Field>
            </div>

            <Field label="Medidas" ayuda="Opcional. Texto libre por ahora." htmlFor="medidas">
              <Input
                id="medidas"
                value={medidas}
                onChange={(e) => setMedidas(e.target.value)}
                placeholder="Ej: 1x1 m"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Cantidad" error={errores.cantidadTotal} htmlFor="cantidad">
                <Input
                  id="cantidad"
                  type="number"
                  min={0}
                  value={cantidadTotal}
                  onChange={(e) => setCantidadTotal(e.target.value)}
                />
              </Field>

              <Field
                label="Stock minimo"
                ayuda="Aviso en el dashboard"
                htmlFor="stockMinimo"
              >
                <Input
                  id="stockMinimo"
                  type="number"
                  min={0}
                  value={stockMinimo}
                  onChange={(e) => setStockMinimo(e.target.value)}
                />
              </Field>

              <Field label="Precio / Valor" error={errores.precio} htmlFor="precio">
                <Input
                  id="precio"
                  type="number"
                  min={0}
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0.00"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo de comercio" error={errores.tipoComercio} htmlFor="tipo">
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
                {enviando ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button
                type="button"
                variante="secundario"
                onClick={() => navegar('/inventario')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
