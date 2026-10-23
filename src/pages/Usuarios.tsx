import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usuariosApi } from '../lib/endpoints'
import { useAvisos } from '../lib/avisos'
import { ApiError } from '../lib/api'
import { Badge, Button, Card, Cargando, Vacio } from '../components/ui'
import ModalConfirmar from '../components/ModalConfirmar'
import { ROL_ETIQUETA } from '../types'
import type { Usuario } from '../types'

/**
 * Tabla de usuarios (ADMINISTRADOR).
 *
 * <p>Muestra las columnas que pide el documento: nick, nombre, apellido,
 * rol, y las opciones de eliminar y modificar.
 */
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null)
  const [aEliminar, setAEliminar] = useState<Usuario | null>(null)
  const [procesando, setProcesando] = useState(false)
  const { exito, error } = useAvisos()

  const cargar = useCallback(async () => {
    try {
      setUsuarios(await usuariosApi.listar())
    } catch (e) {
      error(e instanceof ApiError ? e.message : 'No se pudo cargar la lista de usuarios')
      setUsuarios([])
    }
  }, [error])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function confirmarEliminacion() {
    if (!aEliminar) return
    setProcesando(true)
    try {
      await usuariosApi.eliminar(aEliminar.id)
      exito(`Usuario ${aEliminar.username} desactivado`)
      setAEliminar(null)
      await cargar()
    } catch (e) {
      // El backend explica por que no se pudo (por ejemplo, si es el unico
      // administrador). Se muestra tal cual.
      error(e instanceof ApiError ? e.message : 'No se pudo desactivar el usuario')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Gestion de usuarios</h1>
          <p className="mt-1 text-sm text-slate-500">
            Usuarios con acceso al sistema y su rol correspondiente.
          </p>
        </div>
        <Link to="/usuarios/nuevo">
          <Button>Agregar nuevo usuario</Button>
        </Link>
      </div>

      <Card>
        {usuarios === null ? (
          <Cargando />
        ) : usuarios.length === 0 ? (
          <Vacio mensaje="Todavia no hay usuarios registrados." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Nick</th>
                  <th className="px-5 py-3 font-medium">Nombre</th>
                  <th className="px-5 py-3 font-medium">Apellido</th>
                  <th className="px-5 py-3 font-medium">Correo</th>
                  <th className="px-5 py-3 font-medium">Rol</th>
                  <th className="px-5 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs">{u.username}</td>
                    <td className="px-5 py-3">{u.nombre}</td>
                    <td className="px-5 py-3">{u.apellido}</td>
                    <td className="px-5 py-3 text-slate-600">{u.email}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-1">
                        <Badge tono="info">{ROL_ETIQUETA[u.rol]}</Badge>
                        {!u.activo && <Badge tono="neutro">Inactivo</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/usuarios/modificar?username=${encodeURIComponent(u.username)}`}>
                          <Button variante="secundario">Modificar</Button>
                        </Link>
                        <Button
                          variante="peligro"
                          onClick={() => setAEliminar(u)}
                          disabled={!u.activo}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {aEliminar && (
        <ModalConfirmar
          titulo="Desactivar usuario"
          mensaje={
            <>
              Estas seguro de desactivar a{' '}
              <strong>{aEliminar.nombreCompleto}</strong> ({aEliminar.username})?
              <br />
              <span className="text-slate-500">
                El usuario no podra volver a entrar, pero su historial queda
                guardado.
              </span>
            </>
          }
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setAEliminar(null)}
          procesando={procesando}
        />
      )}
    </div>
  )
}