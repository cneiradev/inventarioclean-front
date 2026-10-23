import { useCallback, useEffect, useState } from 'react'
import { auditoriaApi } from '../lib/endpoints'
import { useAvisos } from '../lib/avisos'
import { ApiError } from '../lib/api'
import { Badge, Button, Card, Cargando, Select, Vacio } from '../components/ui'
import type { AccionAuditoria, RegistroAuditoria } from '../types'

/** Etiquetas legibles de cada accion auditada. */
const ETIQUETAS_ACCION: Record<AccionAuditoria, string> = {
  CREAR_USUARIO: 'Creo usuario',
  MODIFICAR_USUARIO: 'Modifico usuario',
  ELIMINAR_USUARIO: 'Desactivo usuario',
  CREAR_PRODUCTO: 'Creo producto',
  MODIFICAR_PRODUCTO: 'Modifico producto',
  ELIMINAR_PRODUCTO: 'Desactivo producto',
  AJUSTAR_STOCK: 'Ajusto stock',
}

/** Formato de fecha en espanol, sin depender del locale del navegador. */
function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Historial de acciones (solo ADMINISTRADOR).
 *
 * <p>Es el requerimiento explicito del documento: quedar registro de quien
 * hizo cada accion y cuando, para resolver dudas a futuro.
 */
export default function Auditoria() {
  const { error } = useAvisos()
  const [registros, setRegistros] = useState<RegistroAuditoria[] | null>(null)
  const [filtro, setFiltro] = useState<AccionAuditoria | ''>('')
  const [total, setTotal] = useState(0)

  const cargar = useCallback(async () => {
    try {
      const respuesta = await auditoriaApi.listar(filtro || undefined, 0, 100)
      setRegistros(respuesta.content)
      setTotal(respuesta.totalElements)
    } catch (e) {
      error(e instanceof ApiError ? e.message : 'No se pudo cargar la auditoria')
      setRegistros([])
    }
  }, [filtro, error])

  useEffect(() => {
    cargar()
  }, [cargar])

  return (
    <div className="space-y-4 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Registro de acciones</h1>
        <p className="mt-1 text-sm text-slate-500">
          Evidencia de cada accion realizada en el sistema: quien la hizo, cuando y que cambio.
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap items-end gap-3 border-b border-slate-200 p-4">
          <div className="min-w-56">
            <label htmlFor="accion" className="block text-xs font-medium text-slate-600">
              Filtrar por accion
            </label>
            <Select
              id="accion"
              className="mt-1"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as AccionAuditoria | '')}
            >
              <option value="">Todas las acciones</option>
              {(Object.keys(ETIQUETAS_ACCION) as AccionAuditoria[]).map((a) => (
                <option key={a} value={a}>
                  {ETIQUETAS_ACCION[a]}
                </option>
              ))}
            </Select>
          </div>
          <Button variante="secundario" onClick={cargar}>
            Actualizar
          </Button>
        </div>

        {registros === null ? (
          <Cargando />
        ) : registros.length === 0 ? (
          <Vacio mensaje="Todavia no hay acciones registradas." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Usuario</th>
                  <th className="px-4 py-3 font-medium">Accion</th>
                  <th className="px-4 py-3 font-medium">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registros.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                      {formatearFecha(r.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">{r.username}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tono="neutro">{ETIQUETAS_ACCION[r.accion]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{r.detalle ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
          {total} {total === 1 ? 'accion registrada' : 'acciones registradas'}
        </p>
      </Card>
    </div>
  )
}