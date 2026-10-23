import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usuariosApi } from '../lib/endpoints'
import { useAvisos } from '../lib/avisos'
import { ApiError } from '../lib/api'
import { Button, Card, Field, Input, Select } from '../components/ui'
import { ROL_ETIQUETA } from '../types'
import type { Rol } from '../types'

type Errores = Partial<Record<'nombre' | 'apellido' | 'email' | 'rol' | 'password', string>>

/**
 * Formulario de usuario: sirve para crear y para modificar.
 *
 * <p>En modo edicion se llega por query param `?username=...`, porque el
 * documento pide buscar al usuario por su nombre de usuario y no por id.
 *
 * <p>El username no es un campo editable: lo genera el backend con la regla
 * del cliente (inicial + apellido). En edicion se muestra solo como
 * referencia, porque cambiarlo significaria reescribir el historial.
 */
export default function UsuarioForm() {
  const navegar = useNavigate()
  const [params] = useSearchParams()
  const usernameBuscado = params.get('username')
  const esEdicion = Boolean(usernameBuscado)

  const { exito, error } = useAvisos()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState<Rol>('OPERADOR')
  const [password, setPassword] = useState('')

  const [idUsuario, setIdUsuario] = useState<number | null>(null)
  const [usernameActual, setUsernameActual] = useState<string | null>(null)
  const [errores, setErrores] = useState<Errores>({})
  const [cargando, setCargando] = useState(esEdicion)
  const [enviando, setEnviando] = useState(false)

  // En edicion se busca por username y se rellena el formulario.
  useEffect(() => {
    if (!usernameBuscado) return

    let vigente = true
    setCargando(true)

    usuariosApi
      .buscarPorUsername(usernameBuscado)
      .then((u) => {
        if (!vigente) return
        setIdUsuario(u.id)
        setUsernameActual(u.username)
        setNombre(u.nombre)
        setApellido(u.apellido)
        setEmail(u.email)
        setRol(u.rol)
      })
      .catch((e) => {
        if (!vigente) return
        error(e instanceof ApiError ? e.message : 'No se pudo buscar el usuario')
        navegar('/usuarios', { replace: true })
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [usernameBuscado, error, navegar])

  function validar(): boolean {
    const nuevos: Errores = {}

    if (!nombre.trim()) nuevos.nombre = 'El nombre es obligatorio'
    if (!apellido.trim()) nuevos.apellido = 'El apellido es obligatorio'
    if (!email.trim()) {
      nuevos.email = 'El correo es obligatorio'
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      nuevos.email = 'El correo no tiene un formato valido'
    }
    if (password.length < 8) {
      nuevos.password = esEdicion
        ? 'Si cambias la contrasena, debe tener al menos 8 caracteres'
        : 'La contrasena debe tener al menos 8 caracteres'
    }

    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return

    setEnviando(true)
    try {
      if (esEdicion && idUsuario !== null) {
        await usuariosApi.actualizar(idUsuario, {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email: email.trim(),
          rol,
          // En edicion, vacio significa "mantener la actual".
          password,
        })
        exito('Usuario modificado')
      } else {
        const creado = await usuariosApi.crear({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email: email.trim(),
          rol,
          password,
        })
        // Se informa el username generado: el usuario necesita saberlo para
        // poder entrar, y es el dato que el admin debe comunicarle.
        exito(`Usuario creado con el usuario ${creado.username}`)
      }
      navegar('/usuarios')
    } catch (e) {
      if (e instanceof ApiError) {
        // Si el backend senala un campo concreto, se marca en el formulario.
        if (e.campos) setErrores(e.campos as Errores)
        error(e.message)
      } else {
        error('No se pudo guardar el usuario')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        {esEdicion ? 'Modificar usuario' : 'Agregar nuevo usuario'}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {esEdicion
          ? 'Los cambios se guardan al confirmar.'
          : 'El nombre de usuario se genera automaticamente: inicial del nombre mas el primer apellido.'}
      </p>

      {cargando ? (
        <p className="mt-8 text-sm text-slate-500">Cargando...</p>
      ) : (
        <div className="mt-6 max-w-2xl">
          <Card titulo="Datos del usuario">
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {esEdicion && usernameActual && (
                <Field label="Nombre de usuario" ayuda="No se puede cambiar">
                  <Input value={usernameActual} disabled readOnly />
                </Field>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" error={errores.nombre} htmlFor="nombre">
                  <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Field>

                <Field label="Apellido" error={errores.apellido} htmlFor="apellido">
                  <Input
                    id="apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Correo institucional" error={errores.email} htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field label="Rol" error={errores.rol} htmlFor="rol">
                <Select id="rol" value={rol} onChange={(e) => setRol(e.target.value as Rol)}>
                  {(Object.keys(ROL_ETIQUETA) as Rol[]).map((r) => (
                    <option key={r} value={r}>
                      {ROL_ETIQUETA[r]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label={esEdicion ? 'Nueva contrasena' : 'Contrasena'}
                error={errores.password}
                ayuda={
                  esEdicion
                    ? 'Dejalo vacio para mantener la contrasena actual.'
                    : 'Minimo 8 caracteres.'
                }
                htmlFor="password"
              >
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={enviando}>
                  {enviando ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button
                  type="button"
                  variante="secundario"
                  onClick={() => navegar('/usuarios')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
