import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { api, clearToken, getToken, setToken } from './api'
import type { LoginResponse, UsuarioActual } from '../types'

/**
 * Estado de sesion del frontend.
 *
 * <p>El token vive en localStorage para sobrevivir a un refresh, y los datos
 * del usuario se revalidan contra `/api/auth/me` al cargar la aplicacion: si
 * el token expiro o el usuario fue dado de baja, se cae la sesion y se vuelve
 * al login. Confiar solo en el token guardado seria mostrar la app a alguien
 * que ya no tiene acceso.
 *
 * <p>Ojo: esto NO es seguridad. La autorizacion real la aplica el backend en
 * cada peticion. Aqui solo se decide que se ve.
 */

type AuthContextValue = {
  usuario: UsuarioActual | null
  /** true mientras se revalida la sesion al arrancar: evita un parpadeo al login. */
  cargando: boolean
  estaAutenticado: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioActual | null>(null)
  const [cargando, setCargando] = useState(true)

  // Al montar: si hay token, se confirma con el backend que sigue siendo valido.
  useEffect(() => {
    let cancelado = false

    async function revalidar() {
      if (!getToken()) {
        setCargando(false)
        return
      }

      try {
        const actual = await api<UsuarioActual>('/api/auth/me')
        if (!cancelado) setUsuario(actual)
      } catch (e) {
        // 401: el backend ya limpio el token. Cualquier otro error (por
        // ejemplo, la API caida) tambien cierra la sesion: es preferible
        // pedir la contrasena otra vez que mostrar una app a medias.
        if (!cancelado) {
          clearToken()
          setUsuario(null)
        }
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    revalidar()
    return () => {
      cancelado = true
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const respuesta = await api<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { username, password },
      auth: false,
    })

    setToken(respuesta.token)
    // Se guarda el usuario sin el token: el estado de sesion no necesita
    // arrastrarlo, y queda claro que la credencial vive en el almacen del
    // token y no en el contexto.
    const { token: _token, tipoToken: _tipoToken, ...usuarioActual } = respuesta
    setUsuario(usuarioActual)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUsuario(null)
  }, [])

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      estaAutenticado: usuario !== null,
      login,
      logout,
    }),
    [usuario, cargando, login, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

/** Acceso al contexto. Lanza error si se usa fuera del Provider. */
export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return contexto
}